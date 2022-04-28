import { Injectable } from '@nestjs/common';

import { ArticleRepository } from '../repositories/article.repository';
import { Article } from '../schemas/article.schema';

@Injectable()
export class ArticleService {

  constructor(
    private articleRepository: ArticleRepository
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleRepository.getAll(projectId);
  }

  async getByCode(code: string, projectId: string): Promise<Article> {
    return await this.articleRepository.getByCode(code, projectId);
  }

  async create(code: string, projectId: string): Promise<Article> {
    /*const item: Item = await this.itemService.getByCode(code);

    if(!item) {
      return;
    }

    return await this.articleRepository.create({ code, name: item.name, maker: item.maker, thumbnail: item.thumbnail, doc: item.doc, group: item.group }, projectId);*/

    return;
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleRepository.update(group, articleId, projectId);
  }

}
