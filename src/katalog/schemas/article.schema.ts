import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { Project } from '../schemas/project.schema';

export type ArticleDocument = Article & Document;

@Schema({ versionKey: false })
export class Article {

  @Prop()
  tag: string;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  maker: string;

  @Prop()
  thumbnail: string;

  @Prop()
  doc: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: Article;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
