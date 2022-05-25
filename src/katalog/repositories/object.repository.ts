import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { join } from 'path';
import { createWriteStream, createReadStream } from 'fs';

import { Object, IObject, ObjectSource } from '../schemas/object.schema';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class ObjectRepository {

  private thumbnailsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    @InjectModel(IObject.name) private objectModel: Model<Object>,
    private categoryRepository: CategoryRepository
  ) {
    this.thumbnailsPath = config.get('PATH_THUMBNAILS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async get(id: string): Promise<Object> {
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

}
