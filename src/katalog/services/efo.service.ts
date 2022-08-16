import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { join } from 'path';

import { CategoryRepository } from '../repositories/category.repository';
import { ObjectRepository } from '../repositories/object.repository';
import { IObject, ObjectSource } from '../schemas/object.schema';
import { StorageService } from '../services/storage.service';

@Injectable()
export class EfoService {

  private thumbnailsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private categoryRepository: CategoryRepository,
    private objectRepository: ObjectRepository,
    private storageService: StorageService
  ) {
    this.thumbnailsPath = config.get('PATH_THUMBNAILS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async search(codes: string[]): Promise<IObject[]> {
    const url = 'https://efobasen.efo.no/API/AlleProdukter/HentProdukter';
    const filter = {
      Statusvalg: [1, 8, 2],
      Page: 1,
      Pagesize: 50,
      Visningsmodus: 2,
      EtimEgenskaper: [],
      Feltvalg: [],
      KunGrossiststempel: null,
      Search: null,
      Sortering: -4,
      ProduktnummerFra: null,
      ProduktnummerTil: null,
      Produktnummertallstreng: codes.join('\n'),
      ETIMKlasse: null,
      Leverandor: null,
      Dokumentasjon: null,
      LovpaalagtDokumentasjon: null,
      FiltrerFeltmangel: null,
      Bilder: null,
      KlasseId: null,
      Varegruppe: null,
      AvansertSok: null,
      Type: null,
      VisKunFeil: null
    }
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(filter)
    }
    const response = await fetch(url, options);
    const data = await response.json();

    if(response.status !== 200) {
      return [];
    }

    const objects: IObject[] = [];
    const promiseList = [];

    for(const efo of data['Produkter']) {
      promiseList.push(this.parse(efo));
    }

    const promiseResult = await Promise.all(promiseList);

    for(const object of promiseResult) {
      if(object) objects.push(object);
    }

    return objects;
  }

  private searchDocument(id: string, list: any[]): string {
    const doc1 = list.find(d => d['Navn'] === 'FDV');
    const doc2 = list.find(d => d['Navn'] === 'Produktblad');
    if(doc1) return doc1['Id'];
    if(doc2) return doc2['Id'];
    if(list.length) console.log(id, 'NOT FOUND', list);
    throw 'no doc';
  }

  private async parse(efo: any): Promise<IObject> {
    const object = {} as IObject;

    try {
      object._id = efo['Produktnr'];
      object.name = efo['Varetekst'];
      object.maker = efo['Firma'];
      object.category = efo['EtimKode'];
      object['thumbnailId'] = efo['Bilde'];
      object['documentId'] = this.searchDocument(efo['Produktnr'], efo['Dokumenter']);
    }
    catch(e) {
      return null;
    }

    object.group = await this.categoryRepository.get(object.category);
    object.source = ObjectSource.EFOBASEN;

    try {
      const thumbnailUrl = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${object['thumbnailId']}&w=350&h=350&m=3`;
      const documentUrl = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${object['documentId']}`;
      await this.downloadArticleFile(thumbnailUrl, join(this.thumbnailsPath, `${object._id}.jpg`));
      await this.downloadArticleFile(documentUrl, join(this.documentsPath, `${object._id}.pdf`));
      await this.storageService.uploadThumbnail(join(this.thumbnailsPath, `${object._id}.jpg`));
      delete object['thumbnailId'];
      delete object['documentId'];
    }
    catch(e) {
      return null;
    }

    await this.objectRepository.create(object);
    return object;
  }

  private async downloadArticleFile(url: string, path: string): Promise<void> {
    const res = await fetch(url);
    const stream = createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(stream);
      res.body.on('error', reject);
      stream.on('finish', resolve);
    });
  }

}
