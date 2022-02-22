import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { existsSync, createWriteStream } from 'fs';
import { join } from 'path';

import { Efobasen, EfobasenDocument } from '../schemas/efobasen.schema';

@Injectable()
export class EfobasenService {

  private docPath: string;

  constructor(
    @InjectModel(Efobasen.name) private efobasenModel: Model<EfobasenDocument>
  ) {
    this.docPath = join(__dirname, '..', '..', 'pdf');
  }

  async getByTag(tag: string): Promise<Efobasen> {console.log(this.docPath);
    const dbEfobasen: Efobasen = await this.findByTagFromDatabase(tag);

    if(dbEfobasen) {
      console.log('found on db');
      return dbEfobasen;
    }

    const efobasen: Efobasen = await this.findByTagfromWebsite(tag);

    if(efobasen) {
      const newEfobasen = new this.efobasenModel(efobasen);
      await newEfobasen.save();
    }

    return efobasen;
  }

  async findByTagFromDatabase(tag: string): Promise<Efobasen> {
    const efobasen: Efobasen = await this.efobasenModel.findOne({ tag }).lean();
    const hasDoc: boolean = existsSync(join(this.docPath, `${tag}.pdf`));

    if(efobasen && hasDoc) {
      delete efobasen['_id'];
      return efobasen;
    }

    return;
  }

  async findByTagfromWebsite(tag: string): Promise<Efobasen> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${tag}`;
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      return;
    }

    const efobasen: Efobasen = this.parseData(data);

    if(!efobasen) {
      return;
    }

    try {
      await this.downloadDoc(efobasen.doc, join(this.docPath, `${tag}.pdf`));
    }
    catch(e) {
      return;
    }

    return efobasen;
  }

  private parseData(data: any): Efobasen {
    const obj = {} as Efobasen;

    try {
      obj.tag = data['Produktinfo']['Produktnr'].toString();
      obj.name = data['Produktinfo']['Varetekst'];
      obj.maker = data['Produktinfo']['Fabrikat'];
      const pdfObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      obj.doc = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;
    }
    catch(e) {
      return;
    }

    try {
      obj.thumbnail = 'https://efobasen.efo.no/API/Produktfiler/Skalert/' + data['Produktinfo']['Produktnr'] + '.jpg?id=' + data['Produktinfo']['Bilder'][0] + '&w=1000&h=1000&m=5';
    }
    catch(e) { }

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
