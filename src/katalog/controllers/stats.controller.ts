import { Controller, Get } from '@nestjs/common';

@Controller('stats')
export class StatsController {

  @Get()
  public async getStats() {
    return { count: 27 }
  }

}
