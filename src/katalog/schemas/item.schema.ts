import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ItemSource } from '../entities/item-source.enum';

export type ItemDocument = Item & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.createdAt; delete ret.updatedAt; return ret; }
  }
})
export class Item {

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  doc: string;

  @Prop()
  group?: string;

  @Prop()
  source: ItemSource;

}

export const ItemSchema = SchemaFactory.createForClass(Item);

export interface ItemBatch {
  items: Item[],
  count: number
}
