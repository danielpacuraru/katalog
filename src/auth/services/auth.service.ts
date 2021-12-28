import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService
  ) { }

  async login() {
    const payload = { sub: 327 };
    return {
      token: this.jwtService.sign(payload)
    };
  }

}
