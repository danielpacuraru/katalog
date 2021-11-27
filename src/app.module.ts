import { Module } from '@nestjs/common';
import { LaunchOptions } from 'puppeteer';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    KatalogModule
  ]
})
export class AppModule { }
