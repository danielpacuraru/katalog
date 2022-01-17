import { Controller, UseGuards, Post, Get, Req, Body } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { SignupDto } from '../dtos/signup.dto';

@Controller()
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto
  ): Promise<void> {
    const x = await this.authService.createUser(signupDto);
    console.log(x);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const userId = req.user._id.toString();
    const token = await this.authService.generateToken(userId);
    return { token };
  }

  @Get('me')
  async me() {
    return { message: 'hi' }
  }

  

}
