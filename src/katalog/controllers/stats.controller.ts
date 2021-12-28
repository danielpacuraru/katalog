import { Controller, UseGuards, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('stats')
export class StatsController {

  constructor(private config: ConfigService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getStats() {
    return { count: this.config.get('PORT'), total: 5, mode: this.config.get('MODE') }
  }

  @Get('token')
  public async getToken() {
    return { message: 'hi' }
  }

}
