import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';

import { ProjectService } from '../services/project.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Controller('projects')
export class ProjectsController {

  constructor(
    private projectService: ProjectService
  ) { }

  //@UseGuards(JwtAuthGuard)
  @Get()
  public async getProjects() {
    return [];
  }

  @Post()
  async create(
    @Body() data: CreateProjectDto
  ) {
    return await this.projectService.createProject(data);
  }

}
