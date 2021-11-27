import { Injectable, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';

import { Product } from '../models/product';

@Injectable()
export class ScrapperService {

  public async getProduct(id: string): Promise<Product> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
    const response = await fetch(url);

    if(response.status !== 200) {
      return null;
    }

    const data = await response.json();
    let product: Product = {
      id: id,
      name: data['Produktinfo']['Varetekst'],
      imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/' + data['Produktinfo']['Produktnr'] + '.jpg?id=' + data['Produktinfo']['Bilder'][0] + '&w=1000&h=1000&m=3',
      manufacturer: data['Produktinfo']['Fabrikat']
    }

    try {
      const docObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const docObj2 = docObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const docId = docObj2['Verdi']['FilId'];
      product['docUrl'] = docId ? `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${docId}` : undefined;
    }
    catch(e) { }

    return product;
  }

  public async getProductDoc(url: string) {
    return await fetch(url);
  }

}
