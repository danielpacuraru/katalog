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
        JWT_SECRET: Joi.string(),
        MONGO_URL: Joi.string(),
        SPACES_KEY: Joi.string(),
        SPACES_SECRET: Joi.string()
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      }
    })
  ]
})
export class ConfigsModule { }
