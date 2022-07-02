import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { nanoid } from 'nanoid';

const uuidx = () => nanoid(6);

@Schema({
  collection: 'catalogs',
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.projectId;
      return ret;
    }
  }
})
export class ICatalog {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  docs: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, default: uuidx })
  uuid: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId;

}

export type Catalog = ICatalog & Document;

export const CatalogSchema = SchemaFactory.createForClass(ICatalog);
