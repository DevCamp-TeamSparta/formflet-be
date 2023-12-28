import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ResponseEntity } from '../../configs/response-entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { AuthRequestDto } from '../controllers/dtos/requests/auth-request.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async logIn(requestDto: AuthRequestDto, res: Response): Promise<ResponseEntity<{ accessToken: string }>> {
    const user: User = await this.repository.findByEmail(requestDto.email);

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
    this.logger.log('start logout');

    await this.tokenService.deleteRefreshToken(user.id);
    return ResponseEntity.OK('정상적으로 로그아웃 되었습니다.');
  }
}
