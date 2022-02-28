import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import { mkdir, copyFile, rm } from 'fs/promises';
import { zip } from 'zip-a-folder';

import { Project } from '../schemas/project.schema';
import { Article } from '../schemas/article.schema';

@Injectable()
export class CatalogService {

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

  async build(project: Project, articles: Article[]): Promise<boolean> {
    const id: string = project['_id'];
    const name: string = project.name;
    const codes: string[] = articles.map(a => a.code).filter((v, i, a) => { return a.indexOf(v) === i });

    const projectPath = join(__dirname, '..', '..', 'projects', name);
    const projectZipPath = join(__dirname, '..', '..', 'projects', `${id}.zip`);

    // remove project folder and zip file if they exist
    await rm(projectPath, { recursive: true, force: true });
    await rm(projectZipPath, { recursive: true, force: true });

    // create project folder
    await mkdir(projectPath);

    // create project subfolders
    for(const code of codes) {
      const projectCodePath = join(projectPath, code);
      await mkdir(projectCodePath);
    }

    // create project docs
    for(const article of articles) {
      const docPath = join(__dirname, '..', '..', 'pdf', `${article.tag}.pdf`);
      const projectDocPath = join(projectPath, article.code, `${article.code}_${article.tag}.pdf`);
      await copyFile(docPath, projectDocPath);
    }

    // create project zip file
    await zip(projectPath, projectZipPath);

    // remove project folder
    await rm(projectPath, { recursive: true, force: true });

    return true;
  }

}
