import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class User {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  image?: string;
  bio?: string;
  token?: string;
}

export class UserDto {
  @ValidateNested()
  @Type(() => User)
  user: User;
}
