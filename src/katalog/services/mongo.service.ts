import { Injectable } from '@nestjs/common';

import { Product } from '../models/product';

@Injectable()
export class MongoService {

  products: Product[] = [];

  public getProduct(id: string): Product {
    const product = this.products.find(p => p.id === id);
    return product;
  }

}
