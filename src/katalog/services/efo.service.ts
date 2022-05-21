import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { join } from 'path';

import { CategoryRepository } from '../repositories/category.repository';
import { ArticleSource } from '../schemas/article.schema';

export interface Art {
  code: string,
  name: string,
  maker: string,
  category: string,
  group: string,
  source: ArticleSource
}

@Injectable()
export class EfoService {

  private thumbnailsPath: string;
  private documentsPath: string;

  constructor(
    private config: ConfigService,
    private categoryRepository: CategoryRepository
  ) {
    this.thumbnailsPath = config.get('PATH_THUMBNAILS');
    this.documentsPath = config.get('PATH_DOCUMENTS');
  }

  async search(codes: string[]): Promise<Art[]> {
    return await this.searchArticles(codes);
  }

  private async searchArticles(codes: string[]): Promise<Art[]> {
    const url = 'https://efobasen.efo.no/API/AlleProdukter/HentProdukter';
    const filter = {
      Statusvalg: [1, 8, 2],
      Page: 1,
      Pagesize: 50,
      Visningsmodus: 2,
      EtimEgenskaper: [],
      Feltvalg: [],
      KunGrossiststempel: null,
      Search: null,
      Sortering: -4,
      ProduktnummerFra: null,
      ProduktnummerTil: null,
      Produktnummertallstreng: codes.join('\n'),
      ETIMKlasse: null,
      Leverandor: null,
      Dokumentasjon: null,
      LovpaalagtDokumentasjon: null,
      FiltrerFeltmangel: null,
      Bilder: null,
      KlasseId: null,
      Varegruppe: null,
      AvansertSok: null,
      Type: null,
      VisKunFeil: null
    }
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(filter)
    }
    const response = await fetch(url, options);
    const data = await response.json();

    if(response.status !== 200) {
      return [];
    }

    const articles: Art[] = [];
    const promises = [];

    for(const efo of data['Produkter']) {
      promises.push(this.parseArticle(efo));
    }

    const parsedArticles = await Promise.all(promises);

    for(const article of parsedArticles) {
      if(article) articles.push(article);
    }

    return articles;
  }

  private async parseArticle(efo: any): Promise<Art> {
    const article = {} as Art;

    try {
      article.code = efo['Produktnr'];
      article.name = efo['Varetekst'];
      article.maker = efo['Firma'];
      article.category = efo['EtimKode'];
      article['thumbnailId'] = efo['Bilde'];
      article['documentId'] = efo['Dokumenter'].find(d => d['Navn'] === 'FDV')['Id'];
    }
    catch(e) {
      return null;
    }

    article.group = await this.categoryRepository.get(article.category);
    article.source = ArticleSource.EFOBASEN;

    try {
      const thumbnailUrl = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${article['thumbnailId']}&w=350&h=350&m=3`;
      const documentUrl = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${article['documentId']}`;
      await this.downloadArticleFile(thumbnailUrl, join(this.thumbnailsPath, `${article.code}.jpg`));
      await this.downloadArticleFile(documentUrl, join(this.documentsPath, `${article.code}.pdf`));
      delete article['thumbnailId'];
      delete article['documentId'];
    }
    catch(e) {
      return null;
    }

    return article;
  }

  private async downloadArticleFile(url: string, path: string): Promise<void> {
    const res = await fetch(url);
    const stream = createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(stream);
      res.body.on('error', reject);
      stream.on('finish', resolve);
    });
  }

}
