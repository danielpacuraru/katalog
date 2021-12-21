import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/katalog'),
    AuthModule,
    KatalogModule
  ]
})
export class AppModule { }
