import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export enum ProjectStatus {
  EMPTY = 'EMPTY',
  QUEUE = 'QUEUE',
  WORKS = 'WORKS',
  READY = 'READY',
  ERROR = 'ERROR'
}

@Schema({
  collection: 'projects',
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.userId;
      return ret;
    }
  }
})
export class IProject {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: ProjectStatus.EMPTY })
  status: ProjectStatus;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  userId;

}

export type Project = IProject & Document;

export const ProjectSchema = SchemaFactory.createForClass(IProject);
