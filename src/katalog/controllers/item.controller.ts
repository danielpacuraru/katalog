import { Controller, UseGuards, Get, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { ItemService } from '../services/item.service';
import { ItemBatch } from '../schemas/item.schema';

@Controller('items')
export class ItemController {

  constructor(
    private itemService: ItemService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @UserID() userId: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string
  ): Promise<ItemBatch> {
    return await this.itemService.getAll(parseInt(limit, 10), parseInt(skip, 10));
  }

}
