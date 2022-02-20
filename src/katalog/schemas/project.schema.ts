import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.userId; return ret; }
  }
})
export class Project {

  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  isReady: boolean;

  @Prop()
  userId: string;

}

export const ProjectSchema = SchemaFactory.createForClass(Project);
