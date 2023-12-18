import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CtasRequestDto {
  @IsBoolean()
  @ApiProperty({ description: 'cta button 상태' })
  status: boolean;

  @IsString()
  @ApiProperty({ description: 'cta button 내용' })
  content: string;

  @IsString()
  @ApiProperty({ description: 'cta button 링크' })
  link: string;

  @IsString()
  @ApiProperty({ description: 'cta button 글자 크기' })
  fontSize: string;

  @IsString()
  @ApiProperty({ description: 'cta button 글자색' })
  fontColor: string;

  @IsString()
  @ApiProperty({ description: 'cta button 배경색' })
  backgroundColor: string;
}
