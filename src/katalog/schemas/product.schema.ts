import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => { return ret; }
  }
})
export class CProduct {

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
  category?: string;

  @Prop()
  source: ProductSource;

}

export type Product = CProduct & Document;

export const ProductSchema = SchemaFactory.createForClass(CProduct);

export enum ProductSource {
  EFOBASEN = 'EFOBASEN',
  MANUAL = 'MANUAL'
}
