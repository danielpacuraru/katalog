import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

import { ScrapperService } from '../services/scrapper.service';
import { PrintService } from '../services/print.service';
import { Product } from '../models/product';

@Controller('catalog')
export class CatalogController {

  constructor(
    private scrapperService: ScrapperService,
    private printService: PrintService
  ) { }

  @Get()
  async getCatalog(@Query('list') list: string, @Res() res: Response) {
    const products: Product[] = [
      {
        id: '8001115',
        name: 'ELIT LXP-1, LUX-måler',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/8001115.jpg?id=1225856&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1257347',
        manufacturer: 'ELIT'
      },
      {
        id: '2020061',
        name: 'Dyp-presstang HN5',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/2020061.jpg?id=30426&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1057723',
        manufacturer: 'Cembre'
      },
      {
        id: '2020042',
        name: 'C-press klemme C25-C25',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/2020042.jpg?id=27102&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1057728',
        manufacturer: 'Procab AS'
      },
      {
        id: '2020026',
        name: 'Skjøtehylse skru M 16-95',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/2020026.jpg?id=1238803&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1238802',
        manufacturer: 'Procab AS'
      },
      {
        id: '3224042',
        name: 'SLV 1T pendeladapter sort inkl strekkavl',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/3224042.jpg?id=1223307&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1223305',
        manufacturer: 'SLV strømskinne 1-tenning'
      },
      {
        id: '1606114',
        name: 'Ovsp.vern DAC50S-20-440 2P IT',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/1606114.jpg?id=1233174&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1235062',
        manufacturer: 'Citel'
      },
      {
        id: '3224173',
        name: 'SLV Kabelskjøt Y-form 3P 1,00-1,5mm3IP68',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/3224173.jpg?id=1239558&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1239560',
        manufacturer: 'SLV koblingstilbehør'
      },
      {
        id: '3224127',
        name: 'SLV RUSTY® UP/DOWN WL LED FIRK3000/4000K',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/3224127.jpg?id=1239561&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1239578',
        manufacturer: 'SLV VEGGARMATUR'
      },
      {
        id: '3224044',
        name: 'SLV 1T pendeladapter grå inkl strekkavl',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/3224044.jpg?id=1223434&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1223429',
        manufacturer: 'SLV strømskinne 1-tenning'
      },
      {
        id: '6407219',
        name: 'IQ 230V 3.6V Detector Base',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/6407219.jpg?id=1225926&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1225927',
        manufacturer: 'Sikom AS'
      },
      {
        id: '8802985',
        name: 'HSS-R-borsett til metall – 19 deler',
        imageUrl: 'https://efobasen.efo.no/API/Produktfiler/Skalert/8802985.jpg?id=1225691&w=1000&h=1000&m=3',
        docUrl: 'https://efobasen.efo.no/API/Produktfiler/LastNed?id=1225692',
        manufacturer: 'BAHCO'
      }
    ];

    const buffer = await this.printService.printCatalog(products);
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
      'Content-Disposition': 'attachment; filename=katalog.pdf'
    });

    stream.pipe(res);
  }

}
