import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product.controller';
import { CatalogController } from './controllers/catalog.controller';
import { ProductService } from './services/product.service';

@Module({
  controllers: [
    ProductController
    CatalogController
  ],
  providers: [
    ProductService
  ]
})
export class KatalogModule { }
