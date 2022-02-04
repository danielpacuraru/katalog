import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectService } from '../services/project.service';
import { EfobasenService } from '../services/efobasen.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CreateArticleDto } from '../dtos/create-article.dto';

@Controller('projects/:id/articles')
export class ArticlesController {

  constructor(
    private projectService: ProjectService,
    private efobasen: EfobasenService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('id') projectId: string,
    @Body() data: CreateArticleDto
  ) {
    
    const articleTag = data.tag;
    const article = await this.efobasen.getByTag(articleTag);
    console.log(articleTag);
    console.log(article);

    return { ok: true };
  }

}
