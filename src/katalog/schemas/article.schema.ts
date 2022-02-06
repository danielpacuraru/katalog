import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop()
  projectId: string;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
