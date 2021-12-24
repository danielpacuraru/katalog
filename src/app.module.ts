import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    AuthModule,
    KatalogModule
  ]
})
export class AppModule { }
