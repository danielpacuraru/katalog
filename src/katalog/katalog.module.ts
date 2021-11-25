import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product.controller';
import { CatalogController } from './controllers/catalog.controller';
import { StatsController } from './controllers/stats.controller';
import { ScrapperService } from './services/scrapper.service';
import { PrintService } from './services/print.service';

@Module({
  controllers: [
    ProductController,
    CatalogController,
    StatsController
  ],
  providers: [
    ScrapperService,
    PrintService
  ]
})
export class KatalogModule { }
