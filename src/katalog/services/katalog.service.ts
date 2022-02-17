import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';

import { Project } from '../schemas/project.schema';
import { Article } from '../schemas/article.schema';

@Injectable()
export class KatalogService {

  async minimal(res: Response, project: Project, articles: Article[]): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await this.render(res, project, articles);

    await page.setContent(content);

    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    return pdfBuffer;
  }

  async render(res: Response, project: Project, articles: Article[]): Promise<string> {
    return new Promise((resolve, reject) => {
      res.render('katalog', {}, (err, html) => {
        if(err) return reject(err);
        return resolve(html);
      })
    });
  }

}
