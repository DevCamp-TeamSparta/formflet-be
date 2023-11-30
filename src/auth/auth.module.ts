import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './services/refresh-token.service';
import { UsersModule } from '../users/users.module';
import { UserRepository } from '../users/repositories/user.repository';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, RefreshToken]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, UserRepository],
})
export class AuthModule {}
