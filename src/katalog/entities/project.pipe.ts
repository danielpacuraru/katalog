import { Injectable, PipeTransform } from '@nestjs/common';

import { ProjectService } from '../services/project.service';
import { Project } from '../schemas/project.schema';

@Injectable()
export class ProjectPipe implements PipeTransform {

  constructor(private projectService: ProjectService) { }

  async transform(id: string): Promise<Project[]> {
    return this.projectService.getAll('61e53e8e198cdecc0a77d8dd');
  }

}
