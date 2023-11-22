import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dtos/requests/create-user.dto';
import { UpdateUserDto } from '../controllers/dtos/requests/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseEntity } from 'src/common-config/responseEntity';
import { plainToInstance } from 'class-transformer';
import { UserInfoDto } from '../controllers/dtos/responses/user-info.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async signup(createUserDto: CreateUserDto): Promise<ResponseEntity<UserInfoDto>> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = this.repository.create(createUserDto);
    await this.repository.save(user);

    const data = plainToInstance(UserInfoDto, user);

    return ResponseEntity.OK_WITH_DATA(`${user.name}님 가입을 환영합니다.`, data);
  }

  async checkEmail(email: string): Promise<ResponseEntity<string>> {
    const user = await this.repository.findOne({ where: { email: email } });

    if (user) {
      throw new ConflictException('이미 존재하는 email 입니다.');
    }

    return ResponseEntity.OK('사용 가능한 email 입니다.');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
