import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from '../controllers/dtos/requests/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseEntity } from 'src/common-config/responseEntity';
import { CreateUserDto } from '../controllers/dtos/requests/create-user.dto';
import { UserInfoDto } from '../controllers/dtos/responses/user-info.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async joinUser(createUserDto: CreateUserDto): Promise<ResponseEntity<UserInfoDto>> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user: User = this.repository.create(createUserDto);

    try {
      await this.repository.save(user);
    } catch (e) {
      if (e.errno === 1062) {
        throw new ConflictException('이미 존재하는 email 입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const data: UserInfoDto = plainToInstance(UserInfoDto, user);

    return ResponseEntity.OK_WITH_DATA(`${user.name}님 가입을 환영합니다.`, data);
  }

  async checkEmail(email: string): Promise<ResponseEntity<string>> {
    const user = await this.findOne(email);

    if (user) {
      throw new ConflictException('이미 존재하는 email 입니다.');
    }

    return ResponseEntity.OK('사용 가능한 email 입니다.');
  }

  async findOne(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email: email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
