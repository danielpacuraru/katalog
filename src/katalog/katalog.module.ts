import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product.controller';
import { CatalogController } from './controllers/catalog.controller';
import { StatsController } from './controllers/stats.controller';
import { ScrapperService } from './services/scrapper.service';

@Module({
  controllers: [
    ProductController,
    CatalogController,
    StatsController
  ],
  providers: [
    ScrapperService
  ]
})
export class KatalogModule { }
