import { Controller, UseGuards, Post, Get } from '@nestjs/common';

import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';

@Controller()
export class AuthController {

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login() {
    return { count: 27 }
  }

  @Get('me')
  public async me() {
    return { message: 'hi' }
  }

}
