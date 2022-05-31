import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { uniq, difference, flatten, chunk } from 'lodash';

import { ArticleRepository } from '../repositories/article.repository';
import { ObjectRepository } from '../repositories/object.repository';
import { Article, IArticle, ArticleStatus } from '../schemas/article.schema';
import { Object, IObject } from '../schemas/object.schema';
import { EfoService } from '../services/efo.service';

@Injectable()
export class ArticleService {

  constructor(
    private articleRepository: ArticleRepository,
    private objectRepository: ObjectRepository,
    private efoService: EfoService
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleRepository.getAll(projectId);
  }

  async createAll(codes: string[], projectId: string) {
    const existingArticles: Article[] = await this.articleRepository.getAll(projectId);
    const existingCodes: string[] = existingArticles.map(a => a.code);

    codes = uniq(codes);
    codes = difference(codes, existingCodes);

    // TODO - skip cached articles

    const articles = codes.map(code => {
      return {
        code: code,
        status: ArticleStatus.QUEUE
      }
    });

    return await this.articleRepository.createAll(articles, projectId);
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleRepository.update(group, articleId, projectId);
  }

  async delete(id: string, projectId: string): Promise<Article> {
    return await this.articleRepository.delete(id);
  }

}
