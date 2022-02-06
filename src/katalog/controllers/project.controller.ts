import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectService } from '../services/project.service';
import { EfobasenService } from '../services/efobasen.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Controller('projects')
export class ProjectController {

  constructor(
    private projectService: ProjectService,
    private efobasen: EfobasenService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @UserID() userId: string
  ) {
    return await this.projectService.getAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @Param('id') id: string,
    @UserID() userId: string
  ) {
    console.log('project id = ', id);
    const res: any = await this.projectService.get(id, userId);
    res.articles = [];
    return res;
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
