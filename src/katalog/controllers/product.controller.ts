import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { ScrapperService } from '../services/scrapper.service';
import { Product } from '../models/product';

@Controller('product')
export class ProductController {

  constructor(private scrapperService: ScrapperService) { }

  @Get(':id')
  public async getProduct(@Param('id') id: string): Promise<Product> {
    const product = await this.scrapperService.getProduct(id);
    return product;
  }

  @Get(':id/doc')
  public async getProductDoc(@Param('id') id: string, @Res() res: Response) {
    const product = await this.scrapperService.getProduct(id);
    const response = await this.scrapperService.getProductDoc(product.docUrl);

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename=qwerty_hello_${product.id}.pdf`);

    response.body.pipe(res);
  }

}
