import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ versionKey: false })
export class Project {

  @Prop()
  name: string;

  @Prop()
  title: string;

}

export const ProjectSchema = SchemaFactory.createForClass(Project);
