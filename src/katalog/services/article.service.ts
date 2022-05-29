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

    await this.articleRepository.createAll(articles, projectId);
    return await this.articleRepository.getAll(projectId);
  }

  async automate() {
    const articles: Article[] = await this.articleRepository.getQueue();
    const codes: string[] = articles.map(a => a.code);

    if(codes.length === 0) return;

    const codeChunks = chunk(codes, 5);
    const foundArticles = [];
    for(const chunk of codeChunks) {
      const y = await this.efoService.search(chunk);
      foundArticles.push(y);
    }
    const newArticles = flatten(foundArticles);

    for(const code of codes) {
      const article = newArticles.find(a => a.code === code);
      if(article) {
        await this.articleRepository.updateByCode(code, {
          name: article.name,
          maker: article.maker,
          category: article.category,
          group: article.group,
          source: article.source,
          status: ArticleStatus.SUCCESS
        });
      }
      else {
        await this.articleRepository.updateByCode(code, {
          status: ArticleStatus.ERROR
        });
      }
    }

    this.automate();
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleRepository.update(group, articleId, projectId);
  }

  async delete(id: string, projectId: string): Promise<Article> {
    return await this.articleRepository.delete(id);
  }

}
