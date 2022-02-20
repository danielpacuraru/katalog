import { Controller, UseGuards, Get, Post, Param, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { ProjectService } from '../services/project.service';
import { ArticleService } from '../services/article.service';
import { KatalogService } from '../services/katalog.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';

@Controller('projects/:id/katalog')
export class KatalogController {

  constructor(
    private projectService: ProjectService,
    private articleService: ArticleService,
    private katalogService: KatalogService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('minimal')
  async minimal(
    @UserID() userId: string,
    @Param('id') projectId: string,
    @Res() res: Response
  ) {
    /*const tpl = await this.katalog.render(res);
    console.log(tpl);*/

    const project = await this.projectService.get(projectId, userId);
    const articles = await this.articleService.getAll(projectId);

    console.log('project');
    console.log(project);
    console.log('articles');
    console.log(articles);

    const buffer: Buffer = await this.katalogService.minimal(res, project, articles);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    });

    res.end(buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async build(
    @UserID() userId: string,
    @Param('id') projectId: string
  ) {
    const project = await this.projectService.get(projectId, userId);
    const articles = await this.articleService.getAll(projectId);
    return this.katalogService.build(project, articles);
  }



}
