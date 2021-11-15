import { Controller, Get, Param } from '@nestjs/common';
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
}
