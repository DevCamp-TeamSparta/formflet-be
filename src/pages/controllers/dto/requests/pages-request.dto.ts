import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PagesRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 title' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 domain' })
  domain: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '노션 페이지 URL' })
  url: string;
}
