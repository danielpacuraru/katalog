import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Efobasen, EfobasenSchema } from './schemas/efobasen.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

import { EfobasenService } from './services/efobasen.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';

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
    EfobasenService,
    ProjectService,
    ArticleService
  ],
  controllers: [
    ProjectController,
    ArticleController,
    KatalogController
  ]
})
export class KatalogModule { }
