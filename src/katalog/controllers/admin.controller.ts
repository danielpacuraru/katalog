import { Controller, UseGuards, Get, Post, Param, Body, UnauthorizedException } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CategoryRepository } from '../repositories/category.repository';

@Controller('admin')
export class AdminController {

  constructor(
    private categoryRepository: CategoryRepository
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  async createCategories(
    @UserID() userId: string
  ) {
    if(userId !== '61e53e8e198cdecc0a77d8dd') {
      throw new UnauthorizedException();
    }

    return 'ok';
  }

}
