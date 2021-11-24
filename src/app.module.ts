import { Module } from '@nestjs/common';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    KatalogModule
  ]
})
export class AppModule { }
