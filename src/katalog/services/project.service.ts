import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from '../entities/create-project.dto';
import { ProjectStatus } from '../entities/project-status.enum';

@Injectable()
export class ProjectService {

  constructor(private projectRepository: ProjectRepository) { }

  async getAll(userId: string): Promise<Project[]> {
    return await this.projectRepository.getAll(userId);
  }

  async get(id: string, userId: string): Promise<Project> {
    return await this.projectRepository.get(id, userId);
  }

  async create(data: CreateProjectDto, userId: string): Promise<Project> {
    return await this.projectRepository.create(data, userId);
  }

  async setStatus(id: string, status: ProjectStatus): Promise<Project> {
    return await this.projectRepository.setStatus(id, status);
  }

}
