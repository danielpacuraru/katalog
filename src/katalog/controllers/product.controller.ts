import { Controller, UseGuards, Get, Post, Query, Body } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {

  constructor(
    private productService: ProductService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @UserID() userId: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string
  ) {
    return await this.productService.getAll(parseInt(limit, 10), parseInt(skip, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserID() userId: string,
    @Body() data
  ) {
    return await this.productService.create(data.id);
  }

}
