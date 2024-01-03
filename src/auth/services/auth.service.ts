import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ResponseEntity } from '../../configs/response-entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { AuthRequestDto } from '../controllers/dtos/requests/auth-request.dto';
import { Request } from 'express';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async logIn(requestDto: AuthRequestDto, res: Response): Promise<ResponseEntity<{ accessToken: string }>> {
    this.logger.log('login');

    const user: User = await this.usersService.findUserByEmail(requestDto.email);

    if (!user) {
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해 주세요.');
    }

    const isAuth: boolean = await bcrypt.compare(requestDto.password, user.password);

    if (!isAuth) {
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해 주세요.');
    }

    const accessToken: string = this.tokenService.generateAccessToken(user);

    await this.tokenService.generateRefreshToken({ user, res });

    const data = { accessToken };

    return ResponseEntity.OK_WITH_DATA(`${user.name}님 환영합니다.`, data);
  }

  async logout(user: User): Promise<ResponseEntity<string>> {
    this.logger.log('logout');

    await this.tokenService.deleteRefreshToken(user.id);
    return ResponseEntity.OK('정상적으로 로그아웃 되었습니다.');
  }

  async reissue(req: Request): Promise<ResponseEntity<{ accessToken: string }>> {
    this.logger.log('reissueToken');

    const rfrTokenInCookie = req.cookies['Refresh-Token'];

    const userId = this.tokenService.getUserIdByRefreshToken(rfrTokenInCookie);

    const rfrTokenInDb = await this.tokenService.getRefreshTokenByUserId(userId);

    const isValid: boolean = await this.tokenService.verifyRefreshToken(rfrTokenInCookie, rfrTokenInDb);

    if (isValid) {
      const user: User = await this.usersService.findUserByUserId(userId);

      const accessToken: string = this.tokenService.generateAccessToken(user);

      const data = { accessToken };

      return ResponseEntity.OK_WITH_DATA(`reissue`, data);
    }

    throw new UnauthorizedException('Invalid');
  }
}
