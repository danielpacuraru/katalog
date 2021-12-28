import { Module } from '@nestjs/common';

import { ConfigsModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    ConfigsModule,
    AuthModule,
    KatalogModule
  ]
})
export class AppModule { }
