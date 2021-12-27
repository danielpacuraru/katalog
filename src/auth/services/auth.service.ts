import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService
  ) { }

  async login() {
    const payload = { sub: 27 };
    return {
      token: this.jwtService.sign(payload)
    };
  }

}
