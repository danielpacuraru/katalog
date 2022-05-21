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

    this.automate();

    return await this.articleRepository.getAll(projectId);
  }

  async automate() {
    const articles: Article[] = await this.articleRepository.getQueue();
    const codes: string[] = articles.map(a => a.code);

    const codeChunks = chunk(codes, 5);
    await this.efoService.search(codeChunks[0]);
  }

  async create(code: string, projectId: string) {
    const object: Object = await this.objectRepository.get(code);

    if(object) {
      console.log('in DB');
      console.log(object);
      return 'found';
    }

    console.log(object);

    const object2: Object = await this.objectRepository.find(code);

    console.log('found');
    console.log(object2);


    /*const item: Item = await this.itemService.getByCode(code);

    if(!item) {
      return;
    }

    return await this.articleRepository.create({ code, name: item.name, maker: item.maker, thumbnail: item.thumbnail, doc: item.doc, group: item.group }, projectId);*/

    return 'not found';
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleRepository.update(group, articleId, projectId);
  }

  async delete(id: string, projectId: string): Promise<Article> {
    return await this.articleRepository.delete(id);
  }

}
