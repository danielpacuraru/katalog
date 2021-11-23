import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(
    private productService: ProductService
  ) { }

  @Get('/product/:id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @Get('/product/:id/doc')
  async getProductDoc(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.getProduct(id);

    const response = await fetch(product.docUrl);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename=qwerty_hello_${product.id}.pdf`);
    response.body.pipe(res);
  }

  @Get('/katalog')
  async getKatalog(@Res() res: Response) {
    const ids: string[] = ['8001115', '2020061', '2020042', '2020026', '3224042', '1606114', '3224173', '3224127', '3224044', '6407219', '8802985'];
    const buffer = await this.productService.printKatalog();

    res.set({
      // pdf
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,
    })

    res.end(buffer)
  }

}
