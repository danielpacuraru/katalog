import { Controller } from '@nestjs/common';

@Controller('product')
export class ProductController {

  @Get(':id')
  async getProduct() {
    return { okish: false }
  }

}
