import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { User } from 'src/model/user.schema';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  async register(@Body() userDto: UserDto): Promise<User> {
    return await this.usersService.register(userDto);
  }
}
