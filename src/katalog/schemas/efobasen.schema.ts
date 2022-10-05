import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'efobasen',
  timestamps: true
})
export class IEfobasen {

  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  etim?: string;

  @Prop()
  image?: number;

  @Prop()
  fdv?: number;

}

export type Efobasen = IEfobasen & Document;

export const EfobasenSchema = SchemaFactory.createForClass(IEfobasen);
