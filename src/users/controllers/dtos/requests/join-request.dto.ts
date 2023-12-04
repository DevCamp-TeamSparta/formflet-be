import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class JoinRequestDto {
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

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이름' })
  name: string;

  @Expose()
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '전화번호' })
  mobile: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '직업' })
  job: string;
}
