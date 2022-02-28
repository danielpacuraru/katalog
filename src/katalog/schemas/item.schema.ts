import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ItemSource } from '../entities/item-source.enum';

export type ItemDocument = Item & Document;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => { return ret; }
  }
})
export class Item {

  @Prop()
  code: string;

  @Prop()
  group: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  thumbnail: string;

  @Prop()
  doc: string;

  @Prop()
  source: ItemSource;

}

export const ItemSchema = SchemaFactory.createForClass(Item);
