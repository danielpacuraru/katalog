import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../services/user.service';
import { User } from '../schemas/user.schema';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    return user;
  }

  public async generateToken(id: string) {
    return this.jwtService.sign({ sub: id });
  }

  async signup(data: SignupDto): Promise<void> {
    console.log(data);
    this.userService.add(data);
  }

}
