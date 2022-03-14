import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import { mkdir, copyFile, rm } from 'fs/promises';
import { zip } from 'zip-a-folder';

import { Project } from '../schemas/project.schema';
import { Article } from '../schemas/article.schema';

@Injectable()
export class CatalogService {

  private projectsPath: string;
  private archivesPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService
  ) {
    this.projectsPath = config.get('PATH_PROJECTS');
    this.archivesPath = config.get('PATH_ARCHIVES');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async build(project: Project, articles: Article[]): Promise<boolean> {
    const id: string = project['id'];
    const name: string = project.name;
    const groups: string[] = articles.map(a => a.group).filter((v, i, a) => { return a.indexOf(v) === i });
    const projectPath = join(this.projectsPath, id);
    const archivePath = join(this.archivesPath, `${id}.zip`);

    // remove project folder and zip file if they exist
    await rm(projectPath, { recursive: true, force: true });
    await rm(archivePath, { recursive: true, force: true });

    // create project folder
    await mkdir(projectPath);
    const projectNamePath = join(projectPath, name);
    await mkdir(projectNamePath);

    // create project subfolders
    for(const group of groups) {
      const projectGroupPath = join(projectPath, name, group);
      await mkdir(projectGroupPath);
    }

    // create project docs
    for(const article of articles) {
      const documentSrcPath = join(this.documentsPath, `${article.code}.pdf`);
      const documentDestPath = join(projectPath, name, article.group, `${article.group}_${article.code}_${article.maker}.pdf`);
      await copyFile(documentSrcPath, documentDestPath);
    }

    // create project zip file
    await zip(projectNamePath, archivePath);

    // remove project folder
    await rm(projectPath, { recursive: true, force: true });
    return true;
  }

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
