import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/user.schema';
import { LoginDto, RegisterDto } from './user.dto';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import { JwtService } from '@nestjs/jwt';
import { classToPlain } from 'class-transformer';

export type UserRes = { user: User };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findOneByUserName(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).select('+password');
  }

  async register(registerDto: RegisterDto): Promise<UserRes> {
    const user = await this.findOneByUserName(registerDto.user.username);
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    const salt = makeSalt();
    const password = encryptPassword(registerDto.user.password, salt);
    const token = this.jwtService.sign(classToPlain(registerDto.user));
    const newUser = {
      ...registerDto.user,
      password,
      bio: salt,
      token,
      // image: '',// todo: 设置默认头像
    };
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
    const user = await this.findOneByEmail(loginDto.user.email);
    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    const hashPassword = encryptPassword(loginDto.user.password, user.bio);
    if (hashPassword !== user.password) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    user.token = this.jwtService.sign(classToPlain(loginDto.user));
    return await this.findOne(user);
  }

  async findOne(user: User): Promise<UserRes> {
    const res = await this.userModel.findById(user._id);
    return { user: res };
  }
}
