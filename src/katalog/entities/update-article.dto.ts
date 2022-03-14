import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateArticleDto {

  @IsNotEmpty()
  @IsString()
  group: string;

}
