import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Item, ItemDocument } from '../schemas/item.schema';

@Injectable()
export class ItemRepository {

  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>
  ) { }

  async getByCode(code: string): Promise<Item> {
    const item: ItemDocument = await this.itemModel.findOne({ code }).exec();

    if(!item) {
      return;
    }

    return item.toJSON();
  }

  async create(data: Item): Promise<Item> {
    const item: ItemDocument = new this.itemModel(data);
    await item.save();

    return item.toJSON();
  }

}
