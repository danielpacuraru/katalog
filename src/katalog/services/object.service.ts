import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

import { ObjectRepository } from '../repositories/object.repository';
import { Object, IObject, ObjectSource } from '../schemas/object.schema';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class ObjectService {

  constructor(
    private objectRepository: ObjectRepository,
    private categoryRepository: CategoryRepository
  ) { }

  async getAll(): Promise<Object[]> {
    return await this.objectRepository.getAll();
  }

  async get(id: string): Promise<Object> {
    const data = await this.find('8883423');
    console.log(data);
    return await this.objectRepository.get(id);
  }

  async create(code: string): Promise<Object> {
    const data = await this.find(code);
    return await this.objectRepository.create(data);
  }

  async find(id: string): Promise<IObject> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = {} as IObject;

    if(response.status !== 200) {
      return;
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
      return;
    }

    result.category = await this.categoryRepository.get(result.class);

    return result;
  }

}
