import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';

import { ItemRepository } from '../repositories/item.repository';
import { Item, ItemBatch } from '../schemas/item.schema';
import { ItemSource } from '../entities/item-source.enum';

@Injectable()
export class ItemService {

  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private itemRepository: ItemRepository
  ) {
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async getAll(limit: number, skip: number): Promise<ItemBatch> {
    const limit2 = limit ? limit : 10;
    const skip2 = skip ? skip : 0;
    return await this.itemRepository.getAll(limit2, skip2);
  }

  async getByCode(code: string): Promise<Item> {
    const item: Item = await this.itemRepository.getByCode(code);

    if(item) {
      return item;
    }

    return await this.findByCode(code);
  }

  async findByCode(code: string): Promise<Item> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${code}`;
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      return;
    }

    const item: Item = this.parseData(data);

    if(!item) {
      return;
    }

    try {
      await this.downloadDoc(item.doc, join(this.documentsPath, `${code}.pdf`));
    }
    catch(e) {
      return;
    }

    return await this.itemRepository.create(item);
  }

  private parseData(data: any): Item {
    const obj = {} as Item;

    try {
      obj.code = data['Produktinfo']['Produktnr'].toString();
      obj.name = data['Produktinfo']['Varetekst'].trim().replace('/', '-');
      obj.maker = data['Produktinfo']['Fabrikat'].trim().replace('/', '-');

      const imgId = data['Produktinfo']['Bilder'].length ? data['Produktinfo']['Bilder'][0] : null;
      if(imgId) obj.thumbnail = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${imgId}&w=350&h=350&m=3`;

      const pdfObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      obj.doc = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;
      obj.source = ItemSource.EFOBASEN;
    }
    catch(e) {
      return;
    }

    return obj;
  }

  private async downloadDoc(url: string, path: string): Promise<void> {
    const response = await fetch(url);
    const fileStream = createWriteStream(path);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
  }

}
