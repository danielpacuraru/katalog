import { Controller, UseGuards, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../entities/create-article.dto';

@Controller('projects/:id/articles')
export class ArticleController {

  constructor(
    private articleService: ArticleService
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
    const article = await this.articleService.create(data.code, projectId);

    if(!article) {
      throw new NotFoundException();
    }

    return article;
  }

}
