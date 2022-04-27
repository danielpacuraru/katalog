import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Object, IObject, ObjectSource } from '../schemas/object.schema';

@Injectable()
export class ObjectRepository {

  constructor(
    @InjectModel(IObject.name) private objectModel: Model<Object>
  ) { }

  async getAll(): Promise<Object[]> {
    return await this.objectModel.find().exec();
  }

  async get(id: string): Promise<Object> {
    return await this.objectModel.findById(id).exec();
  }

  async create(object: IObject): Promise<Object> {
    const newObject: Object = new this.objectModel(object);
    return await newObject.save();
  }

}
