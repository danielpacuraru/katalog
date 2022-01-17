import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  salt: string;

  @Prop()
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
