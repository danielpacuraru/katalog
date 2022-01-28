import { Controller, UseGuards, Post, Get, Request, Body } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserID } from '../decorators/user-id.decorator';

@Controller()
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto
  ): Promise<void> {
    await this.authService.createUser(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @UserID() userId: string
  ) {
    const token = await this.authService.generateToken(userId);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Request() req
  ) {
    const { name, email } = req.user;
    return { name, email }
  }

}
