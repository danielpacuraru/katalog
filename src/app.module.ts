import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { LaunchOptions } from 'puppeteer';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    PuppeteerModule.forRoot(<LaunchOptions>{
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    }),
    KatalogModule
  ]
})
export class AppModule { }
