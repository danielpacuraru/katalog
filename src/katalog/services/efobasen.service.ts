import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class EfobasenService {

  private urlById(id: string): string {
    return `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${id}`;
  }

  public parse(data: any) {
    let obj = {};

    try {
      obj['id'] = data['Produktinfo']['Produktnr'].toString();
      obj['name'] = data['Produktinfo']['Varetekst'];
      obj['manufacturer'] = data['Produktinfo']['Fabrikat'];
    }
    catch(e) {
      return;
    }

    try {
      obj['imageUrl'] = 'https://efobasen.efo.no/API/Produktfiler/Skalert/' + data['Produktinfo']['Produktnr'] + '.jpg?id=' + data['Produktinfo']['Bilder'][0] + '&w=1000&h=1000&m=3';
    }
    catch(e) { }

    try {
      const pdfObj1 = data['Produktskjema']['Skjema1']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      obj['pdfUrl'] = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;
    }
    catch(e) { }

    return obj;
  }

  public async find(id: string) {
    const url = this.urlById(id);
    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200) {
      return;
    }

    return this.parse(data);
  }

}
