import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';

import { ProjectService } from '../services/project.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Controller('projects')
export class ProjectsController {

  constructor(
    private projectService: ProjectService
  ) { }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async getProjects() {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() data: CreateProjectDto,
    @UserID() userId: string
  ) {
    return await this.projectService.create(data, userId);
  }

}
