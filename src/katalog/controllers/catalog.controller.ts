import { Controller, UseGuards, Get, Post, Param, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectByIdPipe } from '../entities/project-by-id.pipe';
import { CatalogService } from '../services/catalog.service';
import { Project } from '../schemas/project.schema';
import { Catalog } from '../schemas/catalog.schema';

@Controller('projects/:projectId/catalog')
export class CatalogController {

  constructor(
    private catalogService: CatalogService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Param('projectId', ProjectByIdPipe) project: Project
  ): Promise<Catalog> {
    const catalog = await this.catalogService.get(project._id);

    if(!catalog) {
      throw new NotFoundException();
    }

    return catalog;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('projectId', ProjectByIdPipe) project: Project
  ) {
    return await this.catalogService.create(project);
  }

}
