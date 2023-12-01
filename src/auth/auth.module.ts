import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TokenService } from './services/token.service';
import { Token } from './entities/token.entity';
import { TokenRepository } from './repository/token.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Token]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, TokenRepository, JwtStrategy],
  exports: [AuthService, TokenService, TokenRepository, JwtStrategy],
})
export class AuthModule {}
