import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {

  @Get('user')
  public getUser() {
    return { token: 'x1234' }
  }

}
