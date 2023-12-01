import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../../users/controllers/dtos/requests/login-user.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../token/services/token.service';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
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

    await this.tokenService.generateAccessToken({ user, res });
    await this.tokenService.generateRefreshToken({ user, res });

    return ResponseEntity.OK(`${user.name}님 환영합니다.`);
  }
}
