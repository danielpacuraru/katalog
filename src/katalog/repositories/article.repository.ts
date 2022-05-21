import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Article, IArticle, ArticleStatus } from '../schemas/article.schema';

@Injectable()
export class ArticleRepository {

  constructor(
    @InjectModel(IArticle.name) private articleModel: Model<Article>
  ) { }

  async getAll(projectId: string): Promise<Article[]> {
    return await this.articleModel.find({ projectId }).exec();
  }

  async getQueue(): Promise<Article[]> {
    return await this.articleModel.find({ status: ArticleStatus.QUEUE }).limit(50).exec();
  }

  async createAll(list: any, projectId: string): Promise<Article[]> {
    const articles = list.map(item => {
      return {
        ...item,
        projectId: new Types.ObjectId(projectId)
      }
    });

    return await this.articleModel.insertMany(articles);
  }

  /*async getAll(projectId: string): Promise<Article[]> {
    const articles: ArticleDocument[] = await this.articleModel.find({ projectId }).exec();

    return articles.map(a => a.toJSON());
  }

  async getByCode(code: string, projectId: string): Promise<Article> {
    const article: ArticleDocument = await this.articleModel.findOne({ code, projectId }).exec();

    if(!article) {
      return;
    }

    return article.toJSON();
  }

  async create(data, projectId: string): Promise<Article> {
    const article: ArticleDocument = new this.articleModel({ ...data, projectId: new Types.ObjectId(projectId) });
    await article.save();

    return article.toJSON();
  }

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    const article: ArticleDocument = await this.articleModel.findByIdAndUpdate(articleId, { group }).exec();

    return article.toJSON();
  }

  async createMany(data) {
    await this.articleModel.insertMany(data);
  }*/

  async update(group: string, articleId: string, projectId: string): Promise<Article> {
    return await this.articleModel.findByIdAndUpdate(articleId, { group }).exec();
  }

  async updateByCode(code: string, obj: any) {
    const x = await this.articleModel.updateMany({ code }, obj);
    console.log(x);
  }

  async delete(id: string): Promise<Article> {
    return await this.articleModel.findByIdAndDelete(id);
  }

}
