import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';

import { ItemRepository } from '../repositories/item.repository';
import { Item, ItemBatch } from '../schemas/item.schema';
import { ItemSource } from '../entities/item-source.enum';

@Injectable()
export class ProductService {

  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private itemRepository: ItemRepository
  ) {
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async getAll(limit: number, skip: number) {
    const limit2 = limit ? limit : 10;
    const skip2 = skip ? skip : 0;
    //return await this.itemRepository.getAll(limit2, skip2);
    return [];
  }

  async create(id: string) {
    console.log(id);
  }

}
