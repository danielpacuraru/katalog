import { Module } from '@nestjs/common';

import { StatsController } from './controllers/stats.controller';

@Module({
  controllers: [
    StatsController
  ]
})
export class KatalogModule { }
