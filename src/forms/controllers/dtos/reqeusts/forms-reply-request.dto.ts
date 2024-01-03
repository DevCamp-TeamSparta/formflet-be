import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class FormsReplyRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ description: '폼 답변 설정' })
  answer: string[][];
}
