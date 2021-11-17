import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDto } from 'src/users/user.dto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  user: UserDto;
}

export const UserSchema = SchemaFactory.createForClass(User);
