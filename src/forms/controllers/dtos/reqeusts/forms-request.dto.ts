import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormsRequestDto {
  @IsString()
  @ApiProperty({ description: '폼 제목 설정' })
  formTitle: string;

  @IsString()
  @ApiProperty({ description: '폼 설명 설정' })
  formDescription: string;
}
