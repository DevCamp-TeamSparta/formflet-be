import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ResponseEntity } from 'src/configs/response-entity';
import { JoinRequestDto } from '../controllers/dtos/requests/join-request.dto';
import { UsersResponseDto } from '../controllers/dtos/responses/users-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async joinUser(createUserDto: JoinRequestDto): Promise<ResponseEntity<UsersResponseDto>> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user: UserInterface = this.userRepository.create(createUserDto);

    try {
      await this.userRepository.save(user);
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

  async checkEmail(email: string): Promise<ResponseEntity<string>> {
    const user: UserInterface = await this.userRepository.findByEmail(email);

    if (user) {
      throw new ConflictException('이미 존재하는 email 입니다.');
    }

    return ResponseEntity.OK('사용 가능한 email 입니다.');
  }
}
