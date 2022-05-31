import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ObjectSource {
  EFOBASEN = 'EFOBASEN',
  MANUAL = 'MANUAL'
}

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
  category: string;

  @Prop()
  group?: string;

  @Prop()
  source: ObjectSource;

}

export type Object = IObject & Document;

export const ObjectSchema = SchemaFactory.createForClass(IObject);
