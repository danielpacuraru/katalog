import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Article, ArticleDocument } from '../schemas/article.schema';

@Injectable()
export class ArticleRepository {

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    const articles: ArticleDocument[] = await this.articleModel.find({ projectId }).exec();

    return articles.map(a => a.toJSON());
  }

  async create(data, projectId: string): Promise<Article> {
    const article: ArticleDocument = new this.articleModel({ ...data, projectId: new Types.ObjectId(projectId) });
    await article.save();

    return article.toJSON();
  }

}
