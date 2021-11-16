export class RegisterDto {
  user: {
    email: string;
    password: string;
    username: string;
  };
}

export class UserDto {
  user: {
    email: string;
    password: string;
    username: string;
    image: string;
    bio: string;
    token: string;
  };
}
