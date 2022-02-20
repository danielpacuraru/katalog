import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) { }

  async getAll(userId: string): Promise<Project[]> {
    const projects: Project[] = await this.projectModel.find({ userId }).exec();
    return projects;
  }

  async get(id: string, userId: string): Promise<Project> {
    const project: Project = await this.projectModel.findById(id).exec();

    if(project.userId !== userId) {
      return;
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const newProject = new Project();

    newProject.name = createProjectDto.name;
    newProject.title = '';
    newProject.description = '';
    newProject.isReady = false;
    newProject.userId = userId;

    const project: Project = await new this.projectModel(newProject).save();
    return project;
  }

}
