import { Controller, UseGuards, Post, Get } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';

@Controller()
export class AuthController {

  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login() {
    return this.authService.login();
  }

  @Get('me')
  public async me() {
    return { message: 'hi' }
  }

}
