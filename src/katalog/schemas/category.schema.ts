import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'categories',
  versionKey: false
})
export class ICategory {

  @Prop()
  _id: string;

  @Prop()
  category: string;

}

export type Category = ICategory & Document;

export const CategorySchema = SchemaFactory.createForClass(ICategory);
