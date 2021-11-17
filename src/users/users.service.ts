import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/user.schema';
import { UserDto } from './user.dto';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import { JwtService } from '@nestjs/jwt';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({
      'user.username': username,
    });
  }

  async register(userDto: UserDto): Promise<User> {
    // const user = this.findOne(userDto.user.username);
    const user = await this.userModel.findOne({
      'user.username': userDto.user.username,
      'user.password': userDto.user.password,
    });
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    const salt = makeSalt();
    const password = encryptPassword(userDto.user.password, salt);
    const token = this.jwtService.sign(classToPlain(userDto.user));
    const newUser = {
      ...userDto.user,
      password,
      // todo: 设置默认头像
      image: '',
      // 未知字段
      bio: salt,
      token,
    };
    userDto.user = newUser;
    try {
      return await this.userModel.create(userDto);
    } catch (error) {
      throw new HttpException(
        'SERVICE_UNAVAILABLE',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
