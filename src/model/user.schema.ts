import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  username: string;

  @Prop({ default: '' })
  image: string;

  @Prop()
  bio: string;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
