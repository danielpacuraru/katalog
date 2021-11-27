import { Controller, Get } from '@nestjs/common';

import { MongoService } from '../services/mongo.service';

@Controller('stats')
export class StatsController {

  constructor(private mongoService: MongoService) { }

  @Get('count')
  public async getStatsCount() {
    return { count: this.mongoService.products.length }
  }

  @Get('details')
  public async getStatsDetails() {
    return this.mongoService.products;
  }

}
