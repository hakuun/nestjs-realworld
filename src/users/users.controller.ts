import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { LoginDto, RegisterDto } from './user.dto';
import { UserRes, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  async register(@Body() registerDto: RegisterDto): Promise<UserRes> {
    return await this.usersService.register(registerDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserRes> {
    return await this.usersService.login(loginDto);
  }
}
