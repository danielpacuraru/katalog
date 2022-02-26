import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto } from '../entities/create-project.dto';
import { ProjectStatus } from '../entities/project-status.enum';

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

    if(project.userId.toString() !== userId) {
      return;
    }

    return project.toJSON();
  }

  async create(data: CreateProjectDto, userId: string): Promise<Project> {
    const project: ProjectDocument = new this.projectModel({ ...data, userId: new Types.ObjectId(userId) });
    await project.save();

    return project.toJSON();
  }

  async setStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project: ProjectDocument = await this.projectModel.findById(id).exec();

    project.status = status;
    await project.save();

    return project.toJSON();
  }

}
