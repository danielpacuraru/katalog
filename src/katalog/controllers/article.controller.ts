import { Controller, UseGuards, Get, Post, Put, Param, Body } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ArticleService } from '../services/article.service';
import { Article } from '../schemas/article.schema';
import { CreateArticlesDto } from '../entities/create-articles.dto';
import { UpdateArticleDto } from '../entities/update-article.dto';

@Controller('projects/:projectId/articles')
export class ArticleController {

  constructor(
    private articleService: ArticleService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Param('projectId') projectId: string
  ): Promise<Article[]> {
    return await this.articleService.getAll(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAll(
    @Param('projectId') projectId: string,
    @Body() data: CreateArticlesDto
  ) {
    return await this.articleService.createAll(data.codes, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() data: UpdateArticleDto
  ): Promise<Article> {
    return await this.articleService.update(data.group, id, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/automate')
  async automate(): Promise<void> {
    await this.articleService.automate();
  }

}
