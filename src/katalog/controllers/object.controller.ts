import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ObjectService } from '../services/object.service';
import { Object } from '../schemas/object.schema';
import { CreateObjectDto } from '../entities/create-object.dto';

@Controller('objects')
export class ObjectController {

  constructor(
    private objectService: ObjectService
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

}
