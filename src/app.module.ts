import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { LaunchOptions } from 'puppeteer';

import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    PuppeteerModule.forRoot(<LaunchOptions>{
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      ignoreDefaultArgs: ['--disable-extensions']
    }),
    KatalogModule
  ]
})
export class AppModule { }
