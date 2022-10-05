import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Efobasen, IEfobasen } from '../schemas/efobasen.schema';

@Injectable()
export class EfobasenRepository {

  constructor(@InjectModel(IEfobasen.name) private efobasenModel: Model<Efobasen>) { }

  async create(data): Promise<void> {
    await this.efobasenModel.updateOne({ _id: data._id }, { ...data }, { upsert: true });
  }

}
