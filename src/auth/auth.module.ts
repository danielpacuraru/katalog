import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: 'auth123' }),
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule { }
