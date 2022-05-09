import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number(),
        MODE: Joi.string(),
        PATH_THUMBNAILS: Joi.string(),
        PATH_DOCUMENTS: Joi.string(),
        PATH_PROJECTS: Joi.string(),
        PATH_ARCHIVES: Joi.string(),
        JWT_SECRET: Joi.string(),
        MONGO_URL: Joi.string(),
        AMAZON_S3_KEY: Joi.string(),
        AMAZON_S3_SECRET: Joi.string()
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      }
    })
  ]
})
export class ConfigsModule { }
