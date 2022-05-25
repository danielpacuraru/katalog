import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';

import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../schemas/project.schema';

@Injectable()
export class ProjectByIdPipe implements PipeTransform {

  constructor(private projectRepository: ProjectRepository) { }

  async transform(id: string): Promise<Project> {
    const project: Project = await this.projectRepository.get(id);

    if(!project) {
      throw new NotFoundException();
    }

    return project;
  }

}
