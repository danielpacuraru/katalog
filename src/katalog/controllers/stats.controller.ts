import { Controller, UseGuards, Get } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@Controller('stats')
export class StatsController {

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getStats() {
    return { count: 27 }
  }

  @Get('token')
  public async getToken() {
    return { message: 'hi' }
  }

}
