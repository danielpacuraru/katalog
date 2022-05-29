import { Controller, UseGuards, Get, Post, Param } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectByIdPipe } from '../entities/project-by-id.pipe';
import { CatalogService } from '../services/catalog.service';
import { Project } from '../schemas/project.schema';
import { Catalog } from '../entities/catalog.interface';

@Controller('projects/:projectId/catalog')
export class CatalogController {

  constructor(
    private catalogService: CatalogService
  ) { }

  @Get()
  async get(
    @Param('projectId') uuid: string
  ): Promise<Catalog> {
    return await this.catalogService.get(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('projectId', ProjectByIdPipe) project: Project
  ) {
    await this.catalogService.create(project);
  }

}
