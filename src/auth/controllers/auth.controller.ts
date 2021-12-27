import { Controller, Post, Get } from '@nestjs/common';

@Controller()
export class AuthController {

  @Post('login')
  public async login() {
    return { count: 27 }
  }

  @Get('me')
  public async me() {
    return { message: 'hi' }
  }

}
