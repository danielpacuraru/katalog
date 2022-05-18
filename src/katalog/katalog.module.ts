import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ICategory, CategorySchema } from './schemas/category.schema';
import { IObject, ObjectSchema } from './schemas/object.schema';
import { IArticle, ArticleSchema } from './schemas/article.schema';
import { IProject, ProjectSchema } from './schemas/project.schema';

import { CategoryRepository } from './repositories/category.repository';
import { ObjectRepository } from './repositories/object.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ArticleRepository } from './repositories/article.repository';

import { AwsService } from './services/aws.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';

import { ProjectController } from './controllers/project.controller';
import { ArticleController } from './controllers/article.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ICategory.name, schema: CategorySchema },
      { name: IObject.name, schema: ObjectSchema },
      { name: IArticle.name, schema: ArticleSchema },
      { name: IProject.name, schema: ProjectSchema }
    ])
  ],
  providers: [
    CategoryRepository,
    ObjectRepository,
    ProjectRepository,
    ArticleRepository,

    AwsService,
    ProjectService,
    ArticleService
  ],
  controllers: [
    ProjectController,
    ArticleController
  ]
})
export class KatalogModule { }
