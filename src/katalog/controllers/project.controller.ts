import { Controller, UseGuards, Get, Post, Delete, Param, Body, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ProjectByIdPipe } from '../entities/project-by-id.pipe';
import { ProjectService } from '../services/project.service';
import { Project } from '../schemas/project.schema';
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
  ): Promise<Project[]> {
    return await this.projectService.getAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @UserID() userId: string,
    @Param('id') id: string
  ): Promise<Project> {
    const project = await this.projectService.get(id, userId);

    if(!project) {
      throw new NotFoundException();
    }

    return project;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserID() userId: string,
    @Body() data: CreateProjectDto
  ): Promise<Project> {
    return await this.projectService.create(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ProjectByIdPipe) project: Project,
    @Param('id') id: string
  ): Promise<void> {
    console.log(project);
    console.log(id);
    return await this.projectService.delete(id);
  }

}
