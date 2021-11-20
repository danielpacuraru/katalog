import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

import { ProductService } from './product.service';

@Controller('/product')
export class ProductController {
  constructor(
    private productService: ProductService
  ) { }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @Get('/:id/doc')
  async getProductDoc(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition','attachment; filename=file.pdf');
    const response = await fetch('https://efobasen.efo.no/API/Produktfiler/LastNed?id=1057728');
    //const stream = response.body;
    //let data = Buffer.alloc(0);
    //stream.on('data', chunk => data = Buffer.concat([data, chunk]) );
    response.body.pipe(res);
    //res.end(data);
  }
}
