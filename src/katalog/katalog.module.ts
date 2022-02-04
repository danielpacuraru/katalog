import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Efobasen, EfobasenSchema } from './schemas/efobasen.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

import { EfobasenService } from './services/efobasen.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';

import { ProjectsController } from './controllers/projects.controller';
import { ArticlesController } from './controllers/articles.controller';
import { StatsController } from './controllers/stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Efobasen.name, schema: EfobasenSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Article.name, schema: ArticleSchema }
    ])
  ],
  providers: [
    EfobasenService,
    ProjectService,
    ArticleService
  ],
  controllers: [
    ProjectsController,
    ArticlesController,
    StatsController
  ]
})
export class KatalogModule { }
