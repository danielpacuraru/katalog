import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StorageModule } from '../storage/storage.module';

import { ICategory, CategorySchema } from './schemas/category.schema';
import { IObject, ObjectSchema } from './schemas/object.schema';
import { IArticle, ArticleSchema } from './schemas/article.schema';
import { IProject, ProjectSchema } from './schemas/project.schema';

import { CategoryRepository } from './repositories/category.repository';
import { ObjectRepository } from './repositories/object.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ArticleRepository } from './repositories/article.repository';

import { EfoService } from './services/efo.service';
import { SyncService } from './services/sync.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';
import { CatalogService } from './services/catalog.service';

import { ProjectController } from './controllers/project.controller';
import { ArticleController } from './controllers/article.controller';
import { CatalogController } from './controllers/catalog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ICategory.name, schema: CategorySchema },
      { name: IObject.name, schema: ObjectSchema },
      { name: IArticle.name, schema: ArticleSchema },
      { name: IProject.name, schema: ProjectSchema }
    ]),
    StorageModule
  ],
  providers: [
    CategoryRepository,
    ObjectRepository,
    ProjectRepository,
    ArticleRepository,

    EfoService,
    SyncService,
    ProjectService,
    ArticleService,
    CatalogService
  ],
  controllers: [
    ProjectController,
    ArticleController,
    CatalogController
  ]
})
export class KatalogModule { }
