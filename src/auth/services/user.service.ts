import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  public async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  public async add(signupDto: SignupDto): Promise<User> {
    const myUser = new this.userModel(signupDto);
    return myUser.save();
  }

}
