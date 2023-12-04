import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseEntity } from '../../configs/response-entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { LoginRequestDto } from '../controllers/dtos/requests/login-request.dto';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async logIn(requestDto: LoginRequestDto, res: Response): Promise<ResponseEntity<UsersResponseDto>> {
    const user: User = await this.userRepository.findByEmail(requestDto.email);
    const isAuth: boolean = await bcrypt.compare(requestDto.password, user.password);

    if (!user || !isAuth) {
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해 주세요.');
    }

    await this.tokenService.generateAccessToken({ user, res });
    await this.tokenService.generateRefreshToken({ user, res });

    const data: UsersResponseDto = plainToInstance(UsersResponseDto, user);

    return ResponseEntity.OK_WITH_DATA(`${user.name}님 환영합니다.`, data);
  }
}
