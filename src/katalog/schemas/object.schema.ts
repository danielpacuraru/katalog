import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'objects',
  timestamps: true
})
export class IObject {

  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  thumbnail: string;

  @Prop()
  document: string;

  @Prop()
  class: string;

  @Prop()
  category?: string;

  @Prop()
  source: ObjectSource;

}

export type Object = IObject & Document;

export const ObjectSchema = SchemaFactory.createForClass(IObject);

export enum ObjectSource {
  EFOBASEN = 'EFOBASEN',
  MANUAL = 'MANUAL'
}
