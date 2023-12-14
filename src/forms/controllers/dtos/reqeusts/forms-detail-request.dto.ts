import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormsDetailRequestDto {
  @IsString()
  @ApiProperty({ description: '폼 질문 설정' })
  title: string;

  @IsString()
  @ApiProperty({ description: '폼 답변 종류 설정' })
  type: string;

  @IsString()
  @ApiProperty({ description: '폼 답변 보기 설정' })
  content: string;
}
