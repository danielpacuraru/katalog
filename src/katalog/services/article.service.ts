import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Article, ArticleDocument } from '../schemas/article.schema';
import { Efobasen } from '../schemas/efobasen.schema';

@Injectable()
export class ArticleService {

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>
  ) { }

  async getAll(projectId: string) {
    const articles: Article[] = await this.articleModel.find({ projectId }).lean();

    articles.forEach(a => {
      a['id'] = a['_id'];
      delete a['_id'];
      delete a['projectId'];
    });

    return articles;
  }

  async create(efobasen: Efobasen, projectId: string) {
    const articleObj = new Article();

    articleObj.tag = efobasen.tag;
    articleObj.code = efobasen.code;
    articleObj.name = efobasen.name;
    articleObj.maker = efobasen.maker;
    articleObj.thumbnail = efobasen.thumbnail;
    articleObj.doc = efobasen.doc;
    articleObj.projectId = projectId;

    const article = new this.articleModel(articleObj);
    await article.save();

    const res: any = article.toJSON();
    res.id = res._id;
    delete res._id;
    delete res.projectId;

    return res;
  }

  async do() {
    const list = await this.articleModel.find();

    for(var doc of list) {
      const codes = ['411', '422', '420', '430', '432'];
      const r = Math.floor(Math.random() * 5);
      doc.code = codes[r];
      await doc.save();
    }

    return {};
  }
}
