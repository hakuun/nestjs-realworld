import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDto } from 'src/users/user.dto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: UserDto })
  user: {
    username: string;
    password: string;
    email: string;
    image: string;
    bio: string;
    token: string;
  };

  // @Prop()
  // username: string;

  // @Prop({ select: false })
  // password: string;

  // @Prop()
  // email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
