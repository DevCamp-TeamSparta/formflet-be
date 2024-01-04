import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
