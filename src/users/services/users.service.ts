import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseEntity } from 'src/configs/response-entity';
import { JoinRequestDto } from '../controllers/dtos/requests/join-request.dto';
import { UsersResponseDto } from '../controllers/dtos/responses/users-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { UserInterface } from '../interfaces/user.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from '../../mail/services/mail.service';
import { VerifyEmailRequestDto } from '../controllers/dtos/requests/verify-email-request.dto';
import { VerifyCodeRequestDto } from '../controllers/dtos/requests/verify-code-request.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly repository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async joinUser(requestDto: JoinRequestDto): Promise<ResponseEntity<UsersResponseDto>> {
    requestDto.password = await bcrypt.hash(requestDto.password, 10);

    const user: UserInterface = this.repository.create(requestDto);

    try {
      await this.repository.save(user);
    } catch (e) {
      if (e.errno === 1062) {
        throw new ConflictException('이미 존재하는 email 입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const data: UsersResponseDto = plainToInstance(UsersResponseDto, user);

    return ResponseEntity.OK_WITH_DATA(`${user.name}님 가입을 환영합니다.`, data);
  }

  async verifyEmail(requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('verifyEmail');

    const user: UserInterface = await this.findUserByEmail(requestDto.email);

    if (user) {
      throw new ConflictException('이미 존재하는 email 입니다.');
    }

    const code = this.generateEmailCode();

    await this.cacheManager.set(requestDto.email, code);

    return this.mailService.sendVerificationEmail(requestDto.email, code);
  }

  async verifyCode(requestDto: VerifyCodeRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('verifyCode');

    const cacheEmailCode = await this.cacheManager.get(requestDto.email);

    if (cacheEmailCode !== requestDto.code) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    await this.cacheManager.del(requestDto.email);

    return ResponseEntity.OK('이메일 인증 성공');
  }

  generateEmailCode(): number {
    const min = 1000;
    const max = 9999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async findUserByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async findUserByUserId(userId: number) {
    return await this.repository.findById(userId);
  }
}
