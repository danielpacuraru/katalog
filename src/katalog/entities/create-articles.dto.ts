import { IsArray } from 'class-validator';

export class CreateArticlesDto {

  @IsArray()
  codes: string[];

}
