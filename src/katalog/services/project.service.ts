import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProjectRepository } from '../repositories/project.repository';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto } from '../entities/create-project.dto';
import { ProjectStatus } from '../entities/project-status.enum';

@Injectable()
export class ProjectService {

  constructor(
    private projectRepository: ProjectRepository,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) { }

  async getAll(userId: string): Promise<Project[]> {
    return await this.projectRepository.getAll(userId);
  }

  async get(id: string, userId: string): Promise<Project> {
    return await this.projectRepository.get(id, userId);
  }

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const newProject = new Project();

    newProject.name = createProjectDto.name;
    newProject.title = '';
    newProject.description = '';
    newProject.status = ProjectStatus.EMPTY;
    newProject.userId = userId;

    const project: Project = await new this.projectModel(newProject).save();
    return project;
  }

  async setStatus(id: string, status: ProjectStatus): Promise<ProjectDocument> {
    const project: ProjectDocument = await this.projectModel.findById(id).exec();

    /*if(project.userId !== userId) {
      return;
    }*/

    project.status = status;
    return project.save();
  }

}
