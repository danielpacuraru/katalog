import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { handlebars } from 'hbs';

import { Product } from '../models/product';

@Injectable()
export class PrintService {

  public async printCatalog() {
    const prod: Product[] = [
      /*{
        id:
      }*/
    ];

    this._renderCatalog(prod);
    return { okok: true }
  }

  private _renderCatalog(products: Product[]): string {
    const url = path.join(__dirname, '..', 'templates/catalog.hbs');
    const file = fs.readFileSync(url, 'utf8');
    const template = handlebars.compile(file);
    const html = template(products);
    console.log('rendered html');
    console.log(html);
    return html;
  }

}
