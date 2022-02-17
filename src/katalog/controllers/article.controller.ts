import { Controller, UseGuards, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ArticleService } from '../services/article.service';
import { EfobasenService } from '../services/efobasen.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { Efobasen } from '../schemas/efobasen.schema';

@Controller('projects/:id/articles')
export class ArticleController {

  constructor(
    private articleService: ArticleService,
    private efobasenService: EfobasenService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Param('id') projectId: string
  ) {
    return await this.articleService.getAll(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('id') projectId: string,
    @Body() data: CreateArticleDto
  ) {
    const efobasen: Efobasen = await this.efobasenService.getByTag(data.tag);

    if(!efobasen) {
      throw new NotFoundException();
    }

    return await this.articleService.create(efobasen, projectId);
  }

}
