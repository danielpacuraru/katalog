import { Injectable } from '@nestjs/common';

import { ArticleRepository } from '../repositories/article.repository';
import { Article } from '../schemas/article.schema';

@Injectable()
export class ArticleService {

  constructor(private articleRepository: ArticleRepository) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleRepository.getAll(projectId);
  }

  async create(data, projectId: string): Promise<Article> {
    return await this.articleRepository.create(data, projectId);
  }

}
