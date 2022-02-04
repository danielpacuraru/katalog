import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EfobasenDocument = Efobasen & Document;

@Schema({ collection: 'efobasen', versionKey: false })
export class Efobasen {

  @Prop()
  tag: string;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  thumbnail: string;

  @Prop()
  doc: string;

}

export const EfobasenSchema = SchemaFactory.createForClass(Efobasen);
