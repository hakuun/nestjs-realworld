import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2hrs' },
        };
      },
    }),
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
  ],
  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule {}
