import { Controller, Post, Body } from '@nestjs/common';

import { EfobasenService } from '../services/efobasen.service';
import { CreateArticleDto } from '../dtos/create-article.dto';

@Controller('efobasen')
export class EfobasenController {

  constructor(
    private efobasenService: EfobasenService
  ) { }

  @Post()
  async create(
    @Body() data: CreateArticleDto
  ) {
    return await this.efobasenService.getByTag(data.tag);
  }

}
