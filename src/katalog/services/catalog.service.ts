import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { rm, mkdir, copyFile, access } from 'fs/promises';
import { join } from 'path';
import { uniq } from 'lodash';

import { StorageService } from '../../storage/services/storage.service';
import { ProjectRepository } from '../repositories/project.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { Project } from '../schemas/project.schema';
import { Article } from '../schemas/article.schema';
import { GROUPS } from '../entities/groups.dict';

@Injectable()
export class CatalogService {

  private projectsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private storage: StorageService,
    private projectRepository: ProjectRepository,
    private articleRepository: ArticleRepository
  ) {
    this.projectsPath = config.get('PATH_PROJECTS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async get(uuid: string) {console.log(uuid);
    const project: Project = await this.projectRepository.getByUUID(uuid);

    if(!project) {
      throw new NotFoundException();
    }

    const projectPath: string = join(this.projectsPath, project._id.toString());

    console.log(projectPath);

    // const x = await this.storage.upload(join(this.projectsPath, 'project.zip'), 'none');
    // console.log(x);
  }

  async create(project: Project): Promise<void> {
    const projectId = project._id.toString();
    const projectPath: string = join(this.projectsPath, projectId);
    const projectUrl: string = join('projects', `${projectId}.zip`);
    const projectName: string = project.name;

    await this.build(project);
    await this.storage.uploadProjectZip(projectPath, projectUrl, projectName);
    await rm(projectPath, { recursive: true, force: true });
  }

  async build(project: Project): Promise<void> {
    const projectPath: string = join(this.projectsPath, project._id.toString());
    const articles: Article[] = await this.articleRepository.getAll(project._id.toString());
    const groups: string[] = uniq(articles.map(a => a.group).filter(g => g !== undefined));

    // clean
    await rm(projectPath, { recursive: true, force: true });

    // create main folder
    await mkdir(projectPath);

    // create subfolders
    for(const group of groups) {
      await mkdir(join(projectPath, `${GROUPS[group]}`));
    }

    // copy documents
    for(const article of articles) {
      if(article.group) {
        const src = join(this.documentsPath, `${article.code}.pdf`);
        const dest = join(projectPath, `${GROUPS[article.group]}`, `${article.group}_${article.code}.pdf`);
        await copyFile(src, dest);
      }
    }
  }

}
