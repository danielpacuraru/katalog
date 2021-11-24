import { Controller, Get } from '@nestjs/common';

@Controller('catalog')
export class CatalogController {

  @Get(':id')
  async getCatalog() {
    return { okish: true }
  }

}
