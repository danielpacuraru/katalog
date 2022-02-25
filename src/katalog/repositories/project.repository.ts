import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { classToPlain } from 'class-transformer';

import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectRepository {

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) { }

  async getAll(userId: string): Promise<Project[]> {
    const projects: ProjectDocument[] = await this.projectModel.find({ userId }).exec();
    return projects.map(p => p.toJSON());
  }

  async get(id: string, userId: string): Promise<Project> {
    const project: ProjectDocument = await this.projectModel.findById(id).exec();

    if(project.userId !== userId) {
      return;
    }

    return project.toJSON();
  }

}
