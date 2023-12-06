import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AuthRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
