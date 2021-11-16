import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.usersService.register(registerDto);
  }
}
