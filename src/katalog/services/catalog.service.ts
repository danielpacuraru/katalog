import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import { mkdir, copyFile, rm } from 'fs/promises';
import { zip } from 'zip-a-folder';
import { createReadStream, ReadStream } from 'fs';

import { ProjectService } from '../services/project.service';
import { ArticleService } from '../services/article.service';
import { Project } from '../schemas/project.schema';
import { Article } from '../schemas/article.schema';
import { ProjectStatus } from '../entities/project-status.enum';

@Injectable()
export class CatalogService {

  private projectsPath: string;
  private archivesPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private projectService: ProjectService,
    private articleService: ArticleService
  ) {
    this.projectsPath = config.get('PATH_PROJECTS');
    this.archivesPath = config.get('PATH_ARCHIVES');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  public async build(id: string): Promise<void> {
    const project: Project = await this.projectService.get2(id);
    const articles: Article[] = await this.articleService.getAll(id);
    const name: string = project.name;
    const groups: string[] = articles.map(a => a.group).filter((v, i, a) => { return a.indexOf(v) === i });
    const projectPath = join(this.projectsPath, id);
    const archivePath = join(this.archivesPath, `${id}.zip`);

    try {
      await rm(projectPath, { recursive: true, force: true });
      await rm(archivePath, { recursive: true, force: true });

      await mkdir(projectPath);

      for(const group of groups) {
        const projectGroupPath = join(projectPath, group);
        await mkdir(projectGroupPath);
      }

      for(const article of articles) {
        const documentSrcPath = join(this.documentsPath, `${article.code}.pdf`);
        const documentDestPath = join(projectPath, article.group, `${article.group}_${article.code}_${article.maker}.pdf`);
        await copyFile(documentSrcPath, documentDestPath);
      }

      await zip(projectPath, archivePath);

      await rm(projectPath, { recursive: true, force: true });
    } catch(e) {
      await this.projectService.setStatus(id, ProjectStatus.ERROR);
      console.log('Error building project', id);
      return;
    }

    await this.projectService.setStatus(id, ProjectStatus.READY);
    return;
  }

  public download(id: string): ReadStream {
    const filepath = join(this.archivesPath, id + '.zip');
    return createReadStream(filepath);
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
