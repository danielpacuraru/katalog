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
    /*const efobasen = await this.efobasenService.getByTag(data.tag);

    if(!efobasen) {
      throw new NotFoundException();
    }

    if(!efobasen.code) {
      const codes = ['411', '422', '420', '430', '432'];
      const r = Math.floor(Math.random() * 5);
      efobasen.code = codes[r];
    }

    return await this.articleService.create(efobasen, projectId);*/
    //return await this.articleService.create();

    const article = await this.articleService.create(data.code, projectId);

    if(!article) {
      throw new NotFoundException();
    }

    return article;
  }

}
