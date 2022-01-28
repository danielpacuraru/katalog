import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../services/user.service';
import { User } from '../schemas/user.schema';
import { SignupDto } from '../dtos/signup.dto';

export interface Payload {
  sub: string;
}

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

  public async validateUserByCredentials(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findByEmail(email);

    if(!user || user.password !== await bcrypt.hash(password, user.salt)) {
      throw new UnauthorizedException();
    }

    return user;
  }

  public async generateToken(id: string): Promise<string> {
    const payload: Payload = {
      sub: id
    };

    return this.jwtService.sign(payload);
  }

  public async validateUserByPayload(payload: Payload): Promise<User> {
    const userId: string = payload.sub;
    const user: User = await this.userService.findById(userId);

    if(!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  

  // async createUser(data: SignupDto): Promise<void> {
  //   console.log(data);
  //   this.userService.add(data);
  // }

}
