import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormsRequestDto {
  @IsBoolean()
  @ApiProperty({ description: '새로운 폼 생성' })
  createForm: boolean;

  @IsBoolean()
  @ApiProperty({ description: '폼 상태' })
  status: boolean;

  @IsString()
  @ApiProperty({ description: '폼 가이드' })
  guide: string;
}
