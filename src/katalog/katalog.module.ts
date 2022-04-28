import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ICategory, CategorySchema } from './schemas/category.schema';
import { IObject, ObjectSchema } from './schemas/object.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

import { CategoryRepository } from './repositories/category.repository';
import { ObjectRepository } from './repositories/object.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ArticleRepository } from './repositories/article.repository';

import { ObjectService } from './services/object.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';
import { CatalogService } from './services/catalog.service';

import { ObjectController } from './controllers/object.controller';
import { ProjectController } from './controllers/project.controller';
import { ArticleController } from './controllers/article.controller';
import { CatalogController } from './controllers/catalog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ICategory.name, schema: CategorySchema },
      { name: IObject.name, schema: ObjectSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Article.name, schema: ArticleSchema }
    ])
  ],
  providers: [
    CategoryRepository,
    ObjectRepository,
    ProjectRepository,
    ArticleRepository,

    ObjectService,
    ProjectService,
    ArticleService,
    CatalogService
  ],
  controllers: [
    ObjectController,
    ProjectController,
    ArticleController,
    CatalogController
  ]
})
export class KatalogModule { }
