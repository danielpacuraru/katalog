import { Injectable, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';
import { InjectPage } from 'nest-puppeteer';
import type { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

import { Product } from './product';

@Injectable()
export class ProductService {

  constructor(@InjectPage() private readonly page: Page) { }

  public async getProduct(id: string): Promise<Product> {
    return await this._productInfo(id);
  }

  public async printKatalog(): Promise<Buffer> {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Invoice</h1>
</body>
</html>
`;

    await this.page.setContent(content);

    const buffer = await this.page.pdf({
      printBackground: true,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px'
      }
    });

    return buffer;
  }

  private async _productInfo(id: string): Promise<Product> {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      throw new NotFoundException();
    }

    return this._productParse(data);
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

    let imageUrl: string = null;
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
