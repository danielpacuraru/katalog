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

    await page.setContent(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Katalog</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Hello world!</h1>
</body>
</html>
    `);

    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    return pdfBuffer;
  }

  async render(res: Response): Promise<string> {
    return new Promise((resolve, reject) => {
      res.render('katalog', {}, (err, html) => {
        if(err) return reject(err);
        return resolve(html);
      })
    });
  }

}
