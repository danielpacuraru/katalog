import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Item, ItemDocument } from '../schemas/item.schema';

@Injectable()
export class ItemRepository {

  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>
  ) { }

}
