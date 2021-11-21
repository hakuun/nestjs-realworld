import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/user.schema';
import { UsersService } from './users.service';
import { UserController } from './user/user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
    forwardRef(() => AuthModule),
    AuthModule,
  ],
  providers: [UsersService],

  exports: [UsersService],

  controllers: [UserController],
})
export class UsersModule {}
