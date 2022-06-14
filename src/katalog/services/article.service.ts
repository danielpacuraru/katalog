import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { uniq, difference, concat } from 'lodash';

import { ProjectRepository } from '../repositories/project.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { ObjectRepository } from '../repositories/object.repository';
import { Article, IArticle, ArticleStatus } from '../schemas/article.schema';
import { Object } from '../schemas/object.schema';

@Injectable()
export class ArticleService {

  constructor(
    private projectRepository: ProjectRepository,
    private articleRepository: ArticleRepository,
    private objectRepository: ObjectRepository
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleRepository.getAll(projectId);
  }

  async createAll(codes: string[], projectId: string) {
    // remove duplicates

    codes = uniq(codes);

    // remove already existing articles

    const existingArticles: Article[] = await this.articleRepository.getAll(projectId);
    const existingCodes: string[] = existingArticles.map(a => a.code);

    codes = difference(codes, existingCodes);

    // create articles using cached objects

    const cachedObjects: Object[] = await this.objectRepository.getMany(codes);
    const cachedCodes: string[] = cachedObjects.map(o => o._id);
    const foundArticles: IArticle[] = cachedObjects.map((object: Object) => {
      return {
        code: object._id,
        name: object.name,
        thumbnail: `https://katalog.ams3.digitaloceanspaces.com/thumbnails/${object._id}.jpg`,
        maker: object.maker,
        category: object.category,
        group: object.group,
        status: ArticleStatus.SUCCESS,
        projectId: new Types.ObjectId(projectId)
      }
    });

    codes = difference(codes, cachedCodes);

    // queue remaining codes

    const queuedArticles: IArticle[] = codes.map((code: string) => {
      return {
        code: code,
        status: ArticleStatus.QUEUE,
        projectId: new Types.ObjectId(projectId)
      }
    });

    // update db

    const articles: Article[] = await this.articleRepository.createAll(concat(foundArticles, queuedArticles));
    await this.projectRepository.updateArticles(articles.length, projectId);
    return articles;
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleRepository.update(group, articleId, projectId);
  }

  async delete(id: string, projectId: string): Promise<Article> {
    return await this.articleRepository.delete(id);
  }

}
