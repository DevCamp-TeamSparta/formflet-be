import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;
}
