import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  public async validateUser(email: string, password: string): Promise<any> {
    const user = {
      id: 27,
      email: 'pacurarudaniel@gmail.com',
      password: '123'
    }

    return (email === 'pacurarudaniel@gmail.com' && password === '123') ? user : null;
  }

}
