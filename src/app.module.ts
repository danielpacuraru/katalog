import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { LaunchOptions } from 'puppeteer';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    PuppeteerModule.forRoot(),
    KatalogModule
  ]
})
export class AppModule { }
