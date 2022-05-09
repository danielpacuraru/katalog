import { Controller, UseGuards, Get, Post, Param, Res, StreamableFile, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ReadStream } from 'fs';
import { join } from 'path';

import { ProjectService } from '../services/project.service';
import { ArticleService } from '../services/article.service';
import { CatalogService } from '../services/catalog.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ProjectStatus } from '../entities/project-status.enum';

@Controller('projects/:id/catalog')
export class CatalogController {

  constructor(
    private config: ConfigService,
    private projectService: ProjectService,
    private articleService: ArticleService,
    private catalogService: CatalogService
  ) { }

  /*@UseGuards(JwtAuthGuard)
  @Post()
  async build(
    @UserID() userId: string,
    @Param('id') id: string
  ) {
    const articles = await this.articleService.getAll(id);
    const incompleteArticles = articles.filter(a => a.group === undefined);

    if(incompleteArticles.length > 0) {
      throw new UnprocessableEntityException();
    }

    await this.projectService.setStatus(id, ProjectStatus.QUEUE);

    this.catalogService.build(id);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res
  ): StreamableFile {
    const stream: ReadStream = this.catalogService.download(id);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="effex.zip"',
    });

    return new StreamableFile(stream);
  }*/

}
