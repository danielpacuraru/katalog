import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { ProjectStatus } from '../entities/project-status.enum';
import { User } from '../../auth/schemas/user.schema';

export type ProjectDocument = Project & Document;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.userId; return ret; }
  }
})
export class Project {

  @Prop({ required: true })
  name: string;

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: ProjectStatus.EMPTY })
  status: ProjectStatus;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  userId: User;

}

export const ProjectSchema = SchemaFactory.createForClass(Project);
