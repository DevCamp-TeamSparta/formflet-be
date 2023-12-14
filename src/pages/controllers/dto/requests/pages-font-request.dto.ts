import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PagesFontRequestDto {
  @IsString()
  @ApiProperty({ description: '폰트 스타일 설정' })
  type: string;
}
