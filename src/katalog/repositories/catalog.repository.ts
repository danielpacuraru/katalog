import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Catalog, ICatalog } from '../schemas/catalog.schema';

@Injectable()
export class CatalogRepository {

  constructor(
    @InjectModel(ICatalog.name) private catalogModel: Model<Catalog>
  ) { }

  async get(projectId: string): Promise<Catalog> {
    return await this.catalogModel.findOne({ projectId }).exec();
  }

  async create(data: Partial<ICatalog>, projectId: string): Promise<void> {
    await this.catalogModel.updateOne({ projectId }, { ...data }, { upsert: true });
  }

}
