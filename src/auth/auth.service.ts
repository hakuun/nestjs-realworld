import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils/cryptogram';
import { User } from 'src/model/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    const hashPassword = encryptPassword(password, user.bio);
    if (hashPassword !== user.password) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    console.log('JWT验证 - Step 2: 校验用户信息');
    return user;
  }

  async certificate(user: User): Promise<string> {
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
