import { Controller, UseGuards, Get, Post, Param, Body, UnauthorizedException } from '@nestjs/common';
import fetch from 'node-fetch';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserID } from '../../auth/decorators/user-id.decorator';
import { CategoryRepository } from '../repositories/category.repository';
import { ObjectRepository } from '../repositories/object.repository';
import { IObject, ObjectSource } from '../schemas/object.schema';

@Controller('admin')
export class AdminController {

  constructor(
    private categoryRepository: CategoryRepository,
    private objectRepository: ObjectRepository
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

  @UseGuards(JwtAuthGuard)
  @Get('object/:id')
  async test1(@Param('id') code: string) {
    const x = await this.objectRepository.getOrFind(code);
    console.log(x);
    return x;
  }

  @UseGuards(JwtAuthGuard)
  @Get('objects/:id')
  async test2(@Param('id') code: string) {
    const url = `https://efobasen.efo.no/API/VisProdukt/HentProduktinfo?produktnr=${code}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = {} as IObject;

    if(response.status !== 200) {
      return null;
    }

    try {
      result._id = code;

      result.name = data['Produktinfo']['Varetekst'];

      result.maker = data['Produktinfo']['Fabrikat'];

      result.thumbnail = `https://efobasen.efo.no/API/Produktfiler/Skalert?id=${data['Produktskjema']['Produktinfo']['Bilde']}&w=350&h=350&m=3`;

      result.class = data['Produktskjema']['Produktinfo']['ETIMKode'];

      const pdfObj1 = data['Produktskjema']['Skjema']['Grupper'].find(x => x['Navn'] === 'Dokumenter');
      const pdfObj2 = pdfObj1['Felter'].find(x => x['Navn'] === 'fdv');
      const pdfId = pdfObj2['Verdi']['FilId'];
      result.document = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${pdfId}`;

      result.source = ObjectSource.EFOBASEN;
    }
    catch(e) {
      return null;
    }

    // const category = await this.categoryRepository.get(result.class);
    // if(category) result.category = category;

    return result;
  }

}
