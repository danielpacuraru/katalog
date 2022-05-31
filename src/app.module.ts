import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { ConfigsModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
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
    ScheduleModule.forRoot(),
    AuthModule,
    StorageModule,
    KatalogModule
  ]
})
export class AppModule { }
