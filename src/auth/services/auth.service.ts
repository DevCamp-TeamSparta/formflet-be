import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../users/controllers/dtos/requests/login-user.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from './refresh-token.service';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async logIn(signInUserDto: LoginUserDto, res: Response): Promise<ResponseEntity<string>> {
    const user: User = await this.userRepository.findByEmail(signInUserDto.email);

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 email 입니다.');
    }

    const isAuth: boolean = await bcrypt.compare(signInUserDto.password, user.password);

    if (!isAuth) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    await this.generateAccessToken({ user, res });
    await this.generateRefreshToken({ user, res });

    return ResponseEntity.OK(`${user.name}님 환영합니다.`);
  }

  async generateAccessToken({ user, res }): Promise<void> {
    const accessToken: string = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '5m',
      },
    );

    res.setHeader('Access-Token', `Bearer ${accessToken}`);
  }

  async generateRefreshToken({ user, res }): Promise<void> {
    const refreshToken: string = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: '2w',
      },
    );

    res.setHeader('Refresh-Token', `Bearer ${refreshToken}`);

    await this.refreshTokenService.saveRefreshToken(user.id, refreshToken);
  }
}
