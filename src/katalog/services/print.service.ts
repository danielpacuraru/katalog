import { Injectable } from '@nestjs/common';
import { handlebars } from 'hbs';
import * as path from 'path';
import * as fs from 'fs';
const puppeteer = require('puppeteer');

import { Product } from '../models/product';

@Injectable()
export class PrintService {

  constructor() { }

  public async printCatalog(products: Product[]): Promise<Buffer> {
    const render = this.renderCatalog(products);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(render);
    const buffer = await page.pdf({ printBackground: true });
    await browser.close();
    return buffer;
  }

  public renderCatalog(products: Product[]): string {
    const url = path.join(__dirname, '..', 'templates/catalog.hbs');
    const file = fs.readFileSync(url, 'utf8');
    const template = handlebars.compile(file);
    const html = template({ products });
    return html;
  }

}
