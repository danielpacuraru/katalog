import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Category, ICategory } from '../schemas/category.schema';
import { CreateCategoryDto } from '../entities/create-category.dto';

@Injectable()
export class CategoryRepository {

  constructor(
    @InjectModel(ICategory.name) private categoryModel: Model<Category>
  ) { }

  async get(id: string): Promise<string> {
    const category: Category = await this.categoryModel.findById(id).exec();

    if(!category) {
      return;
    }

    return category.category;
  }

  async create(data: CreateCategoryDto): Promise<void> {
    const newCategory: Category = new this.categoryModel({ _id: data.class, category: data.category });
    await newCategory.save();
  }

}
