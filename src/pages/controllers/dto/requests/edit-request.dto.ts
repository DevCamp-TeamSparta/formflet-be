import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRequestDto {
  @IsString()
  @ApiProperty({ description: '폰트 스타일 설정' })
  type: string;

  @IsBoolean()
  @ApiProperty({ description: '폼 상태 설정' })
  formStatus: boolean;

  @IsString()
  @ApiProperty({ description: '폼 제목 설정' })
  formTitle: string;

  @IsString()
  @ApiProperty({ description: '폼 설명 설정' })
  formDescription: string;
}
