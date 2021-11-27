import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import type { Page } from 'puppeteer';
import { handlebars } from 'hbs';
import * as path from 'path';
import * as fs from 'fs';

import { Product } from '../models/product';

@Injectable()
export class PrintService {

  constructor(@InjectPage() private readonly page: Page) { }

  public async printCatalog(products: Product[]): Promise<Buffer> {
    const render = this.renderCatalog(products);
    await this.page.setContent(render);
    return await this.page.pdf({ printBackground: true });
  }

  public renderCatalog(products: Product[]): string {
    const url = path.join(__dirname, '..', 'templates/catalog.hbs');
    const file = fs.readFileSync(url, 'utf8');
    const template = handlebars.compile(file);
    const html = template({ products });
    return html;
  }

}
