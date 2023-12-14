import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormsRequestDto {
  @IsBoolean()
  @ApiProperty({ description: '폼 상태 설정' })
  status: boolean;

  @IsString()
  @ApiProperty({ description: '폼 제목 설정' })
  title: string;

  @IsString()
  @ApiProperty({ description: '폼 설명 설정' })
  description: string;

  @IsString()
  @ApiProperty({ description: '폼 가이드 설정' })
  guide: string;
}
