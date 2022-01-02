import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../services/user.service';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  async login() {
    const payload = { sub: 327 };
    return {
      token: this.jwtService.sign(payload)
    };
  }

  async signup(data: SignupDto): Promise<void> {
    console.log(data);
    this.userService.add(data);
  }

}
