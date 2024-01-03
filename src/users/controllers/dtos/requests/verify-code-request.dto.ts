import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class VerifyCodeRequestDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: '인증코드' })
  code: number;
}
