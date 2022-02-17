import { Controller } from '@nestjs/common';

import { EfobasenService } from '../services/efobasen.service';

@Controller('efobasen')
export class EfobasenController {

  constructor(
    private efobasenService: EfobasenService
  ) { }

}
