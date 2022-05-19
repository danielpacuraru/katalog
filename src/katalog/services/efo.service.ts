import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { flatten } from 'lodash';

import { IObject, ObjectSource } from '../schemas/object.schema';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class EfoService {

  private thumbnailsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private categoryRepository: CategoryRepository
  ) {
    this.thumbnailsPath = config.get('PATH_THUMBNAILS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async find(codes: string[]): Promise<IObject[]> {
    const promises = [];

    for(let page = 1; page <= Math.ceil(codes.length / 50); page++) {
      promises.push(this.search(codes, page));
    }

    const nestedObjects: Array<Array<IObject>> = await Promise.all(promises);
    const objects: IObject[] = flatten(nestedObjects);

    return objects;
  }

  private async search(codes: string[], page: number): Promise<IObject[]> {
    const url = 'https://efobasen.efo.no/API/AlleProdukter/HentProdukter';
    const filter = {
      Statusvalg: [1, 8],
      Page: page,
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
    const res = await fetch(url, options);
    const data = await res.json();
    const objects: IObject[] = [];

    if(res.status !== 200) {
      return [];
    }

    for(const item of data['Produkter']) {
      const object = await this.parse(item);
      if(object) objects.push(object);
    }

    return objects;
  }

  private async parse(efo: any): Promise<IObject> {
    const object = {} as IObject;

    try {
      object._id = efo['Produktnr'];
      object.name = efo['Varetekst'];
      object.maker = efo['Firma'];
      object.class = efo['EtimKode'];
      object['thumbnailId'] = efo['Bilde'];
      object['documentId'] = efo['Dokumenter'].find(d => d['Navn'] === 'FDV')['Id'];
    }
    catch(e) {
      return null;
    }

    object.category = await this.categoryRepository.get(object.class);
    object.source = ObjectSource.EFOBASEN;

    return object;
  }

  async download(object: IObject) {
    const promise1 = this.downloadThumbnail(object);
    const promise2 = this.downloadDocument(object);

    return await Promise.all([promise1, promise2]);
  }

  private async downloadThumbnail(object: IObject) {
    const url = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${object['thumbnailId']}&w=350&h=350&m=3`;
    const res = await fetch(url);

    if(res.status !== 200) {
      return false;
    }

    const stream = createWriteStream(join(this.thumbnailsPath, `${object._id}.jpg`));

    return new Promise((resolve) => {
      res.body.pipe(stream);
      stream.on('finish', () => resolve(true));
    });
  }

  private async downloadDocument(object: IObject) {
    const url = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${object['documentId']}`;
    const res = await fetch(url);

    if(res.status !== 200) {
      return false;
    }

    const stream = createWriteStream(join(this.documentsPath, `${object._id}.pdf`));

    return new Promise((resolve) => {
      res.body.pipe(stream);
      stream.on('finish', () => resolve(true));
    });
  }

}
