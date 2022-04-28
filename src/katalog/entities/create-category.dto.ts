import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsString()
  category: string;

}
