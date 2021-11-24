import { Injectable, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';

import { Product } from '../models/product';

@Injectable()
export class ScrapperService {

  products: Product[] = [];

  public async getProduct(id: string): Promise<Product> {
    const cachedProduct = this.products.find(p => p.id === id);
    if(cachedProduct) return cachedProduct;
    

    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      throw new NotFoundException();
    }

    const product = this._productParse(data);
    if(this.products.findIndex(p => p.id === product.id) === -1) this.products.push(product);
    return product;
  }

  public async getProductDoc(url: string) {
    return await fetch(url);
  }

  private _productParse(data: any): Product {
    let id: string;
    try {
      id = data['Produktinfo']['Produktnr'].toString()
    }
    catch(e) {
      id = null;
    }

    let name: string = null;
    try {
      name = data['Produktinfo']['Varetekst']
    }
    catch(e) {
      name = null;
    }

    let imageUrl: string = null;;
    try {
      imageUrl = 'https://efobasen.efo.no/API/Produktfiler/Skalert/' + data['Produktinfo']['Produktnr'] + '.jpg?id=' + data['Produktinfo']['Bilder'][0] + '&w=1000&h=1000&m=3'
    }
    catch(e) {
      imageUrl = null;
    }

    let manufacturer: string = null;
    try {
      manufacturer = data['Produktinfo']['Fabrikat']
    }
    catch(e) {
      manufacturer = null;
    }

    let docUrl: string = null;
    try {
      const docObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const docObj2 = docObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const docId = docObj2['Verdi']['FilId'];
      docUrl = 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=' + docId
    }
    catch(e) {
      docUrl = null;
    }

    return { id, name, imageUrl, docUrl, manufacturer }
  }

}
