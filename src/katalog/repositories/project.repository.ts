import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Project, IProject } from '../schemas/project.schema';
import { CreateProjectDto } from '../entities/create-project.dto';
import { ProjectStatus } from '../entities/project-status.enum';

@Injectable()
export class ProjectRepository {

  constructor(
    @InjectModel(IProject.name) private projectModel: Model<Project>
  ) { }

  async getAll(userId: string): Promise<Project[]> {
    return await this.projectModel.find({ userId }).exec();
  }

  async get(id: string): Promise<Project> {
    return await this.projectModel.findById(id).exec();
  }

  async create(data: CreateProjectDto, userId: string): Promise<Project> {
    const project: Project = new this.projectModel({ ...data, userId: new Types.ObjectId(userId) });
    return await project.save();
  }

}
