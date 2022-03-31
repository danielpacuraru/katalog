import { Controller, UseGuards, Get, Post, Param, Res, UnprocessableEntityException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { ProjectService } from '../services/project.service';
import { ArticleService } from '../services/article.service';
import { CatalogService } from '../services/catalog.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ProjectStatus } from '../entities/project-status.enum';

@Controller('projects/:id/catalog')
export class CatalogController {

  constructor(
    private projectService: ProjectService,
    private articleService: ArticleService,
    private catalogService: CatalogService
  ) { }

  @UseGuards(JwtAuthGuard)
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

    await this.catalogService.build(id);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async download(
    @UserID() userId: string,
    @Param('id') id: string
  ) {
    return { ok: true };
  }

}
