import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { PasswordRequestDto } from '../controllers/dtos/requests/password-request.dto';
import { User } from '../entities/user.entity';
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
    this.logger.log('joinUser');

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

  async verifyEmailForJoin(requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('verifyEmailForJoin');

    const isExisted: boolean = await this.checkUserByEmail(requestDto.email);

    if (isExisted) {
      throw new ConflictException('already existed user');
    }

    const code = this.generateEmailCode();

    await this.cacheManager.set(requestDto.email, code);

    this.mailService.sendVerifyEmail(requestDto.email, code);

    return ResponseEntity.OK('sent completed');
  }

  async verifyEmailForPasswordReset(requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('verifyEmailForPasswordReset');

    const isExisted: boolean = await this.checkUserByEmail(requestDto.email);

    if (!isExisted) {
      throw new NotFoundException('not found user');
    }

    const code = this.generateEmailCode();

    await this.cacheManager.set(requestDto.email, code);

    this.mailService.sendVerifyEmail(requestDto.email, code);

    return ResponseEntity.OK('sent completed');
  }

  async verifyEmailCode(requestDto: VerifyCodeRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('verifyEmailCode');

    const cacheEmailCode = await this.cacheManager.get(requestDto.email);

    if (cacheEmailCode !== requestDto.code) {
      throw new UnauthorizedException('not matched code');
    }

    await this.cacheManager.del(requestDto.email);

    return ResponseEntity.OK('matched code');
  }

  async resetPassword(requestDto: PasswordRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('resetPassword');

    const user: User = await this.findUserByEmail(requestDto.email);

    user.password = await bcrypt.hash(requestDto.password, 10);

    await this.repository.save(user);

    return ResponseEntity.OK('비밀번호 재설정 완료');
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.repository.findByEmail(email);
  }

  async findUserByUserId(userId: number): Promise<User> {
    return await this.repository.findById(userId);
  }

  async checkUserByEmail(email: string): Promise<boolean> {
    return !!(await this.findUserByEmail(email));
  }

  generateEmailCode(): number {
    const min = 1000;
    const max = 9999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
