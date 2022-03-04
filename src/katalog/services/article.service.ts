import { Injectable } from '@nestjs/common';

import { ArticleRepository } from '../repositories/article.repository';
import { Article } from '../schemas/article.schema';
import { ItemService } from '../services/item.service';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ArticleService {

  constructor(
    private articleRepository: ArticleRepository,
    private itemService: ItemService
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleRepository.getAll(projectId);
  }

  async create(code: string, projectId: string) {
    const item: Item = await this.itemService.getByCode(code);

    if(!item) {
      return;
    }

    return await this.articleRepository.create({ code,group: item.group, name: item.name, maker: item.maker, thumbnail: item.thumbnail, doc: item.doc }, projectId);
  }

}
