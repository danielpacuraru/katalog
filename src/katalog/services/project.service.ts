import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from '../entities/create-project.dto';

@Injectable()
export class ProjectService {

  constructor(private projectRepository: ProjectRepository) { }

  async getAll(userId: string): Promise<Project[]> {
    return await this.projectRepository.getAll(userId);
  }

  async get(id: string, userId: string): Promise<Project> {
    const project: Project = await this.projectRepository.get(id);

    if(!project || project.userId.toString() !== userId) {
      return null;
    }

    return project;
  }

  async create(data: CreateProjectDto, userId: string): Promise<Project> {
    return await this.projectRepository.create(data, userId);
  }

}
