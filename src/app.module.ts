import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/katalog'),
    KatalogModule
  ]
})
export class AppModule { }
