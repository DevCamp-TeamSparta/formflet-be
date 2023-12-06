import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PagesRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '노션 페이지 URL' })
  pageUrl: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '노선 페이지 내용' })
  content: string;
}
