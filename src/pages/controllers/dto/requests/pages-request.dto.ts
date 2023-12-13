import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PagesRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 title' })
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 domain' })
  domain: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '노션 페이지 URL' })
  url: string;
}
