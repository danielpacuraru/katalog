import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'node-fetch';

import { EfobasenRepository } from '../repositories/efobasen.repository';
import { Article, ArticleStatus } from '../schemas/article.schema';
import { EfoService } from '../services/efo.service';

@Injectable()
export class EfoSyncService {

  constructor(
    private efobasenRepository: EfobasenRepository
  ) { }

  async loadArticles(page: number) {
    const url = 'https://efobasen.efo.no/API/AlleProdukter/HentProdukter';
    const filter = {
      Statusvalg: [1, 8, 2],
      Page: page,
      Pagesize: 50,
      Visningsmodus: 2,
      EtimEgenskaper: [],
      Feltvalg: [],
      KunGrossiststempel: null,
      Search: null,
      Sortering: -4,
      ProduktnummerFra: null,
      ProduktnummerTil: null,
      Produktnummertallstreng: null,
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

    if(response.status !== 200) {
      return null;
    }

    const data = await response.json();

    for(const efo of data['Produkter']) {
      const article = this.parseArticle(efo);
      await this.efobasenRepository.create(article);
    }

    

    /*if(response.status !== 200) {
      return [];
    }

    const objects: IObject[] = [];
    const promiseList = [];

    for(const efo of data['Produkter']) {
      promiseList.push(this.parse(efo));
    }

    const promiseResult = await Promise.all(promiseList);

    for(const object of promiseResult) {
      if(object) objects.push(object);
    }

    return objects;*/
  }

  doc(list: any) {
    const doc = list.find(d => d['Navn'] === 'FDV');
    if(doc) return doc['Id'];
    return undefined;
  }

  parseArticle(efo: any) {
    return {
      _id: efo['Produktnr'],
      name: efo['Varetekst'],
      maker: efo['Firma'],
      etim: efo['EtimKode'] ? efo['EtimKode'] : undefined,
      image: efo['Bilde'],
      fdv: this.doc(efo['Dokumenter'])
    }
  }

  page = 1;

  @Cron(CronExpression.EVERY_30_SECONDS)
  async searchArticles() {
    await this.loadArticles(this.page);
    this.page++;
  }

}
