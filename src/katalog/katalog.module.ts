import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IObject, ObjectSchema } from './schemas/object.schema';
import { Item, ItemSchema } from './schemas/item.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

import { ObjectRepository } from './repositories/object.repository';
import { ItemRepository } from './repositories/item.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ArticleRepository } from './repositories/article.repository';

import { ObjectService } from './services/object.service';
import { ItemService } from './services/item.service';
import { ProductService } from './services/product.service';
import { ProjectService } from './services/project.service';
import { ArticleService } from './services/article.service';
import { CatalogService } from './services/catalog.service';

import { ItemController } from './controllers/item.controller';
import { ObjectController } from './controllers/object.controller';
import { ProjectController } from './controllers/project.controller';
import { ArticleController } from './controllers/article.controller';
import { CatalogController } from './controllers/catalog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IObject.name, schema: ObjectSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Article.name, schema: ArticleSchema }
    ])
  ],
  providers: [
    ObjectRepository,
    ItemRepository,
    ProjectRepository,
    ArticleRepository,

    ObjectService,
    ItemService,
    ProductService,
    ProjectService,
    ArticleService,
    CatalogService
  ],
  controllers: [
    ItemController,
    ObjectController,
    ProjectController,
    ArticleController,
    CatalogController
  ]
})
export class KatalogModule { }
