import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ObjectService } from '../services/object.service';
import { Object } from '../schemas/object.schema';
import { CreateObjectDto } from '../entities/create-object.dto';
import { CreateCategoryDto } from '../entities/create-category.dto';
import { CategoryRepository } from '../repositories/category.repository';

@Controller('objects')
export class ObjectController {

  constructor(
    private objectService: ObjectService,
    private categoryRepository: CategoryRepository
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<Object[]> {
    return await this.objectService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string): Promise<Object> {
    return await this.objectService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: CreateObjectDto): Promise<Object> {
    return await this.objectService.create(data.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  async create2(@Body() data: CreateCategoryDto) {
    return await this.categoryRepository.create(data);
  }

}
