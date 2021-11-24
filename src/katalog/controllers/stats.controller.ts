import { Controller, Get } from '@nestjs/common';
import { Response } from 'express';

import { ScrapperService } from '../services/scrapper.service';

@Controller('stats')
export class StatsController {

  constructor(private scrapperService: ScrapperService) { }

  @Get('count')
  public async getStatsCount() {
    return { count: this.scrapperService.products.length }
  }

  @Get('details')
  public async getStatsDetails() {
    return this.scrapperService.products;
  }

}
