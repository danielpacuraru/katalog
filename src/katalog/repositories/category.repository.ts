import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, ICategory } from '../schemas/category.schema';

@Injectable()
export class CategoryRepository {

  constructor(
    @InjectModel(ICategory.name) private categoryModel: Model<Category>
  ) { }

  async get(id: string): Promise<string> {
    const category: Category = await this.categoryModel.findById(id).exec();
    return category ? category.category : undefined;
  }

}
