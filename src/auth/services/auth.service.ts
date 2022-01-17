import { Injectable, ConflictException } from '@nestjs/common';
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

  public async createUser(signupDto: SignupDto): Promise<User> {
    const userExists: boolean = await this.userService.findByEmail(signupDto.email) !== null;

    if(userExists) {
      throw new ConflictException();
    }

    return this.userService.create(signupDto);
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    return user;
  }

  public async validateUserByPayload(payload: any): Promise<User> {
    const user = await this.userService.findByEmail('email');
    return user;
  }

  public async generateToken(id: string) {
    return this.jwtService.sign({ sub: id });
  }

  // async createUser(data: SignupDto): Promise<void> {
  //   console.log(data);
  //   this.userService.add(data);
  // }

}
