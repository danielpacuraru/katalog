import { Controller, Get } from '@nestjs/common';

import { PrintService } from '../services/print.service';

@Controller('catalog')
export class CatalogController {

  constructor(private printService: PrintService) { }

  @Get()
  async getCatalog() {
    return await this.printService.printCatalog();
  }

}
