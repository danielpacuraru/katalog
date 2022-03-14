import { Controller, UseGuards, Get, Post, Put, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../entities/create-article.dto';
import { UpdateArticleDto } from '../entities/update-article.dto';

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
  @Put(':aid')
  async update(
    @Param('id') projectId: string,
    @Param('aid') articleId: string,
    @Body() data: UpdateArticleDto
  ) {
    console.log(projectId);
    console.log(articleId);
    console.log(data);

    return await this.articleService.update(data.group, articleId, projectId);
  }

}
