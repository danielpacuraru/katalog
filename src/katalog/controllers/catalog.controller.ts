import { Controller, UseGuards, Get, Post, Param } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectByIdPipe } from '../entities/project-by-id.pipe';
import { CatalogService } from '../services/catalog.service';
import { Project } from '../schemas/project.schema';

@Controller('projects/:projectId/catalogs')
export class CatalogController {

  constructor(
    private catalogService: CatalogService
  ) { }

  @Get(':id')
  async get(
    @Param('id') id: string
  ) {
    return await this.catalogService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('projectId', ProjectByIdPipe) project: Project
  ) {
    await this.catalogService.create(project);
  }

}
