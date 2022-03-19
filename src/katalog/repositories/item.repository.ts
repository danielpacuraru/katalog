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
    const hasGroup: boolean = Math.random() > 0.5;
    const groups: string[] = ['411', '422', '430', '432', '440', '510', '612', '640'];
    const group: string = groups[Math.floor(Math.random() * 8)];

    if(hasGroup) data.group = group;

    const item: ItemDocument = new this.itemModel(data);
    await item.save();

    return item.toJSON();
  }

}
