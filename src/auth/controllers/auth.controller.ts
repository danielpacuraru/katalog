import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { SignupDto } from '../dtos/signup.dto';

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

  @Post('signup')
  public async signup(@Body() signupDto: SignupDto) {
    console.log('signup');
    return await this.authService.signup(signupDto);
  }

}
