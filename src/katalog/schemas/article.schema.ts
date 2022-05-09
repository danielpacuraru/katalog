import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { Project } from '../schemas/project.schema';

@Schema({
  collection: 'articles',
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.projectId;
      return ret;
    }
  }
})
export class IArticle {

  @Prop()
  code: string;

  @Prop()
  name?: string;

  @Prop()
  maker?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  document?: string;

  @Prop()
  class?: string;

  @Prop()
  category?: string;

  @Prop()
  status: ArticleStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId;

}

export type Article = IArticle & Document;

export const ArticleSchema = SchemaFactory.createForClass(IArticle);

export enum ArticleStatus {
  QUEUE = 'QUEUE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
