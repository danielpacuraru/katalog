import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export enum ArticleStatus {
  QUEUE = 'QUEUE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum ArticleSource {
  EFOBASEN = 'EFOBASEN',
  MANUAL = 'MANUAL'
}

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

  @Prop({ required: true })
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
  source?: string;

  @Prop({ required: true, default: ArticleStatus.QUEUE })
  status: ArticleStatus;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId;

}

export type Article = IArticle & Document;

export const ArticleSchema = SchemaFactory.createForClass(IArticle);
