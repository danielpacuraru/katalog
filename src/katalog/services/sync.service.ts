import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ArticleRepository } from '../repositories/article.repository';
import { Article, ArticleStatus } from '../schemas/article.schema';
import { EfoService } from '../services/efo.service';

@Injectable()
export class SyncService {

  private working: boolean = false;

  constructor(
    private articleRepository: ArticleRepository,
    private efoService: EfoService
  ) { }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncArticles(forced: boolean = false) {
    if(this.working && !forced) return;

    const articles: Article[] = await this.articleRepository.getQueue(5);
    const codes: string[] = articles.map(a => a.code);

    if(codes.length === 0) {
      this.working = false;
      return;
    }
    else {
      this.working = true;
    }

    const objects = await this.efoService.search(codes);

    console.log(objects.map(o => o._id), objects.length);

    for(const article of articles) {
      const object = objects.find(o => o._id === article.code);

      if(object) {
        article.name = object.name;
        article.thumbnail = `https://katalog.ams3.digitaloceanspaces.com/thumbnails/${article.code}.jpg`;
        article.maker = object.maker;
        article.category = object.category;
        article.group = object.group;
        article.status = ArticleStatus.SUCCESS;
      }
      else {
        article.status = ArticleStatus.ERROR;
      }

      await article.save();
    }

    this.syncArticles(true);
  }

}
