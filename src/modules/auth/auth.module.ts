import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../../jwt/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, RefreshTokenStrategy } from './strategy';

@Module({
  imports: [UsersModule, TokenModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
