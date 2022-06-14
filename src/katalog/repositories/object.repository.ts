import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Object, IObject } from '../schemas/object.schema';

@Injectable()
export class ObjectRepository {

  constructor(@InjectModel(IObject.name) private objectModel: Model<Object>) { }

  async get(code: string): Promise<Object> {
    return await this.objectModel.findById(code).exec();
  }

  async getMany(codes: string[]): Promise<Object[]> {
    return await this.objectModel.find().where('_id').in(codes).exec();
  }

  async create(data: IObject): Promise<void> {
    await this.objectModel.updateOne({ _id: data._id }, { ...data }, { upsert: true });
  }

  /*async get(id: string): Promise<Object> {
    return await this.objectModel.findById(id).exec();
  }

  async getMany(codes: string[]): Promise<Object[]> {
    return await this.objectModel.find().where('_id').in(codes).exec();
  }

  async find(id: string): Promise<Object> {
    const object = null//await this.searchObjects(id);

    if(!object) {
      return null;
    }

    const newObject = new this.objectModel(object);
    return await newObject.save();
  }

  async getOrFind(id: string): Promise<Object> {
    const object = await this.get(id);
    if(object) return object;
    return await this.find(id);
  }

  async create(data: IObject): Promise<void> {
    await this.objectModel.updateOne({ _id: data._id }, { ...data }, { upsert: true });
  }*/

}
