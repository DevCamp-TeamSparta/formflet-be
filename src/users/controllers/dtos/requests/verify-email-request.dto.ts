import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;
}
