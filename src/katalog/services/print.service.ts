import { Injectable } from '@nestjs/common';

@Injectable()
export class PrintService {

  public async printCatalog() {
    return { okok: true }
  }

}
