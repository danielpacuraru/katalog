import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AuthController {

  @Get('me')
  public me() {
    return { token: 'x1234' }
  }

  @Post('login')
  public login() {
    return { token: 'x1234' }
  }

}
