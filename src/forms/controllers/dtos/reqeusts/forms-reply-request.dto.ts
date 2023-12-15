import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormsReplyRequestDto {
  @IsString()
  @ApiProperty({ description: '폼 답변 설정' })
  answer: string;
}
