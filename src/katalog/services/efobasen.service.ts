import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import fetch from 'node-fetch';

import { Efobasen, EfobasenDocument } from '../schemas/efobasen.schema';

@Injectable()
export class EfobasenService {

  constructor(
    @InjectModel(Efobasen.name) private efobasenModel: Model<EfobasenDocument>
  ) { }

  async getByTag(tag: string): Promise<Efobasen> {
    const dbEfobasen: Efobasen = await this.efobasenModel.findOne({ tag }).lean();

    if(dbEfobasen) {
      delete dbEfobasen['_id'];
      return dbEfobasen;
    }

    const efobasen: Efobasen = await this.findByTag(tag);

    if(efobasen) {
      const newEfobasen = new this.efobasenModel(efobasen);
      await newEfobasen.save();
    }

    return efobasen;
  }

  private async findByTag(tag: string): Promise<Efobasen> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${tag}`;
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      return;
    }

    return this.parse(data);
  }

  private parse(data: any): Efobasen {
    const obj = {} as Efobasen;

    try {
      obj.tag = data['Produktinfo']['Produktnr'].toString();
      obj.name = data['Produktinfo']['Varetekst'];
      obj.maker = data['Produktinfo']['Fabrikat'];
    }
    catch(e) {
      return;
    }

    try {
      obj.thumbnail = 'https://efobasen.efo.no/API/Produktfiler/Skalert/' + data['Produktinfo']['Produktnr'] + '.jpg?id=' + data['Produktinfo']['Bilder'][0] + '&w=1000&h=1000&m=3';
    }
    catch(e) { }

    try {
      const pdfObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      obj.doc = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;
    }
    catch(e) { }

    return obj;
  }

}
