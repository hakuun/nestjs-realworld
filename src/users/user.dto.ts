import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class Register {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class RegisterDto {
  @ValidateNested()
  @Type(() => Register)
  user: Register;
}

class Login {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @ValidateNested()
  @Type(() => Login)
  user: Login;
}
