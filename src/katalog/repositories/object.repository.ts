import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { join } from 'path';
import { createWriteStream, createReadStream } from 'fs';

import { Object, IObject, ObjectSource } from '../schemas/object.schema';
import { CategoryRepository } from '../repositories/category.repository';
import { AwsService } from '../services/aws.service';

@Injectable()
export class ObjectRepository {

  private thumbnailsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    @InjectModel(IObject.name) private objectModel: Model<Object>,
    private categoryRepository: CategoryRepository,
    private aws: AwsService
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

  async searchObjects(codes: string[]) {
    const url = 'https://efobasen.efo.no/API/AlleProdukter/HentProdukter';
    const filter = {
      Statusvalg: [1, 8],
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
    const result: IObject[] = [];

    if(response.status !== 200) {
      return null;
    }

    for(const obj of data['Produkter']) {
      const x = await this.parseObject(obj);
      if(x) result.push(x);
    }

    return result;
  }

  private async parseObject(efo: any): Promise<IObject> {
    const object = {} as IObject;

    try {
      const thumbnailId = efo['Bilde'];
      const documentId = efo['Dokumenter'].find(d => d['Navn'] === 'FDV')['Id'];
      object._id = efo['Produktnr'];
      object.name = efo['Varetekst'];
      object.maker = efo['Firma'];
      object.class = efo['EtimKode'];
      object['thumbnail'] = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${thumbnailId}&w=350&h=350&m=3`;
      object['document'] = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${documentId}`;
    }
    catch(e) {
      return null;
    }

    object.category = await this.categoryRepository.get(object.class);
    object.source = ObjectSource.EFOBASEN;

    return object;
  }

  public async download(id: string, url: string): Promise<boolean> {
    const res = await fetch(url);

    if(res.status !== 200) {
      return false;
    }

    const stream = createWriteStream(join(this.documentsPath, `${id}.pdf`));

    return new Promise((resolve) => {
      res.body.pipe(stream);
      stream.on('finish', () => resolve(true));
    });
  }

  // private async upload() {
  //   this.aws.upload(join(this.documentsPath, '1015278.pdf'));
  // }

  /*private async searchEfobasen(id: string): Promise<IObject> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = {} as IObject;

    if(response.status !== 200) {
      return null;
    }

    try {
      result._id = id;

      result.name = data['Produktinfo']['Varetekst'];

      result.maker = data['Produktinfo']['Fabrikat'];

      result.thumbnail = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${data['Produktskjema']['Produktinfo']['Bilde']}&w=350&h=350&m=3`;

      result.class = data['Produktskjema']['Produktinfo']['ETIMKode'];

      const pdfObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      result.document = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;

      result.source = ObjectSource.EFOBASEN;
    }
    catch(e) {
      return null;
    }

    const category = await this.categoryRepository.get(result.class);
    if(category) result.category = category;

    return result;
  }*/

}
