import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '인증코드' })
  code: number;
}
