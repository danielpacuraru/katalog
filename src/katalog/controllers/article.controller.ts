import { Controller, UseGuards, Get, Post, Put, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ArticleService } from '../services/article.service';
import { Article } from '../schemas/article.schema';
import { CreateArticleDto } from '../entities/create-article.dto';
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
  @Post('one')
  async createOne(
    @Param('projectId') projectId: string,
    @Body() data: CreateArticleDto
  ): Promise<Article> {
    const exists = await this.articleService.getByCode(data.code, projectId);

    if(exists) {
      throw new ConflictException();
    }

    const article = await this.articleService.create(data.code, projectId);

    if(!article) {
      throw new NotFoundException();
    }

    return article;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() data
  ) {
    /*const exists = await this.articleService.getByCode(data.code, projectId);

    if(exists) {
      throw new ConflictException();
    }

    const article = await this.articleService.create(data.code, projectId);

    if(!article) {
      throw new NotFoundException();
    }

    return article;*/

    await this.articleService.createMany(data);

    return 'ok';
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

}
