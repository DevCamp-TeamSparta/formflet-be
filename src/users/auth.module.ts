import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, RefreshTokenService],
})
export class AuthModule {}
