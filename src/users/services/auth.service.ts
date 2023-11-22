import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../controllers/dtos/requests/login-user.dto';
import { ResponseEntity } from '../../common-config/responseEntity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(signInUserDto: LoginUserDto, res: Response): Promise<ResponseEntity<string>> {
    const user: User = await this.usersService.findOne(signInUserDto.email);

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

  async generateAccessToken({ user, res }): Promise<string> {
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

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return;
  }

  async generateRefreshToken({ user, res }): Promise<string> {
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

    return;
  }
}
