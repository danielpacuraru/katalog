import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { rm, mkdir, copyFile, access } from 'fs/promises';
import { join } from 'path';
import { uniq } from 'lodash';

import { StorageService } from '../services/storage.service';
import { ProjectRepository } from '../repositories/project.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { CatalogRepository } from '../repositories/catalog.repository';
import { Project } from '../schemas/project.schema';
import { Article, ArticleStatus } from '../schemas/article.schema';
import { GROUPS } from '../entities/groups.dict';
import { Catalog, ICatalog } from '../schemas/catalog.schema';
import { File } from '../entities/file.interface';

@Injectable()
export class CatalogService {

  private projectsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private storage: StorageService,
    private projectRepository: ProjectRepository,
    private articleRepository: ArticleRepository,
    private catalogRepository: CatalogRepository
  ) {
    this.projectsPath = config.get('PATH_PROJECTS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  /*async get(uuid: string): Promise<Catalog> {
    const project: Project = await this.projectRepository.getByUUID(uuid);

    if(!project) {
      throw new NotFoundException();
    }

    const catalog = await this.storage.getCatalogInfo(project._id);

    if(!catalog) {
      throw new NotFoundException();
    }

    return {
      name: project.name,
      url: catalog.url,
      size: catalog.size,
      date: new Date()
    }
  }*/

  async get(projectId: string): Promise<Catalog> {
    return await this.catalogRepository.get(projectId);
  }

  async create2(project: Project): Promise<any> {
    const projectId: string = project._id.toString();
    const catalogPath: string = join(this.projectsPath, projectId);
    const articles: Article[] = await this.articleRepository.getAll(projectId);
    const documents: Article[] = articles.filter(article => article.status === ArticleStatus.SUCCESS);
    const folders: string[] = uniq(documents.map(document => document.category));

    console.log(documents);
    console.log(folders);

    // clean
    await rm(catalogPath, { recursive: true, force: true });

    // create main folder
    await mkdir(catalogPath);

    // create subfolders
    for(const folder of folders) {
      await mkdir(join(catalogPath, folder));
    }

    // copy documents
    for(const document of documents) {
      const src = join(this.documentsPath, `${document.code}.pdf`);
      const dest = join(catalogPath, document.category, `${document.category}_${document.code}.pdf`);
      await copyFile(src, dest);
    }

    // upload catalog
    const catalogFile: File = await this.storage.uploadCatalog(project);

    // clean up again
    await rm(catalogPath, { recursive: true, force: true });

    // save
    await this.catalogRepository.create({ ...catalogFile, docs: documents.length }, projectId);
  }

  async create(project: Project): Promise<any> {
    const projectId: string = project._id.toString();
    const catalogPath: string = join(this.projectsPath, projectId);
    const articles: Article[] = await this.articleRepository.getAll(projectId);
    const documents: Article[] = articles.filter(article => article.group !== undefined && article.status === ArticleStatus.SUCCESS);
    const folders: string[] = uniq(documents.map(document => document.group));
    console.log(folders);

    // clean
    await rm(catalogPath, { recursive: true, force: true });

    // create main folder
    await mkdir(catalogPath);

    // create subfolders
    for(const folder of folders) {
      await mkdir(join(catalogPath, `${GROUPS[folder]}`));
    }

    // copy documents
    for(const document of documents) {
      const src = join(this.documentsPath, `${document.code}.pdf`);
      const destFilename = `${document.group}_${document.code}_${document.name}.pdf`;
      const dest = join(catalogPath, `${GROUPS[document.group]}`, destFilename.replace('/', '-').replace('/', '-').replace('/', '-'));

      await copyFile(src, dest);
    }

    // upload catalog
    const catalogFile: File = await this.storage.uploadCatalog(project);

    // clean up again
    //await rm(catalogPath, { recursive: true, force: true });

    // save
    await this.catalogRepository.create({ ...catalogFile, docs: documents.length }, projectId);
  }

}
