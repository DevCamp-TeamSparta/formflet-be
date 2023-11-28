import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { RefreshTokenService } from '../auth/services/refresh-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, RefreshTokenService],
})
export class UsersModule {}
