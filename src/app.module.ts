import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { ConfigsModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { KatalogModule } from './katalog/katalog.module';

@Module({
  imports: [
    ConfigsModule,
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URL')
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    KatalogModule
  ]
})
export class AppModule { }
