import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../schemas/user.schema';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  public async create(signupDto: SignupDto): Promise<User> {
    const user = new User();

    user.name = signupDto.name;
    user.email = signupDto.email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(signupDto.password, user.salt);

    return new this.userModel(user).save();
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

}
