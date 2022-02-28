import { Controller, UseGuards, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../entities/create-project.dto';

@Controller('projects')
export class ProjectController {

  constructor(
    private projectService: ProjectService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @UserID() userId: string
  ) {
    const projects = await this.projectService.getAll(userId);
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @Param('id') id: string,
    @UserID() userId: string
  ) {
    const project = await this.projectService.get(id, userId);

    if(!project) {
      throw new NotFoundException();
    }

    return project;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() data: CreateProjectDto,
    @UserID() userId: string
  ) {
    const project = await this.projectService.create(data, userId);
    return project;
  }

}
