import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/user.schema';
import { LoginDto, RegisterDto } from './user.dto';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import { AuthService } from 'src/auth/auth.service';

export type UserRes = { user: User };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findOneByUserName(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).select('+password');
  }

  async register(registerDto: RegisterDto): Promise<UserRes> {
    debugger;
    const user = await this.findOneByUserName(registerDto.user.username);
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    const salt = makeSalt();
    const password = encryptPassword(registerDto.user.password, salt);

    const newUser: any = {
      ...registerDto.user,
      password,
      bio: salt,
      image: '', // todo: 设置默认头像
    };
    const token = await this.authService.certificate(newUser);
    newUser.token = token;
    try {
      const user = await this.userModel.create(newUser);
      return await this.findOne(user);
    } catch (error) {
      throw new HttpException(
        'SERVICE_UNAVAILABLE',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<UserRes> {
    const {
      user: { email, password },
    } = loginDto;
    const user = await this.authService.validateUser(email, password);
    user.token = await this.authService.certificate(user);
    return await this.findOne(user);
  }

  async findOne(user: User): Promise<UserRes> {
    const res = await this.userModel.findById(user._id);
    return { user: res };
  }
}
