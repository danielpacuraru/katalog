import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('projects/:id/katalog')
export class KatalogController {

  @UseGuards(JwtAuthGuard)
  @Get('minimal')
  async minimal(
    @Param('id') projectId: string
  ) {
    return { minimal: true }
  }

}
