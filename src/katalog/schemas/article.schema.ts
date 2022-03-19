import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { Project } from '../schemas/project.schema';

export type ArticleDocument = Article & Document;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.projectId; return ret; }
  }
})
export class Article {

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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: Article;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
