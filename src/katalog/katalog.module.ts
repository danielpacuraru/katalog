import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Efobasen, EfobasenSchema } from './schemas/efobasen.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

import { ProjectRepository } from './repositories/project.repository';

import { EfobasenService } from './services/efobasen.service';
import { KatalogService } from './services/katalog.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';

import { EfobasenController } from './controllers/efobasen.controller';
import { ProjectController } from './controllers/project.controller';
import { ArticleController } from './controllers/article.controller';
import { KatalogController } from './controllers/katalog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Efobasen.name, schema: EfobasenSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Article.name, schema: ArticleSchema }
    ])
  ],
  providers: [
    ProjectRepository,
    EfobasenService,
    KatalogService,
    ProjectService,
    ArticleService
  ],
  controllers: [
    EfobasenController,
    ProjectController,
    ArticleController,
    KatalogController
  ]
})
export class KatalogModule { }
