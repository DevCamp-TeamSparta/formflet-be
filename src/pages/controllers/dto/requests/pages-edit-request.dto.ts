import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagesFontRequestDto } from './pages-font-request.dto';
import { FormsRequestDto } from '../../../../forms/controllers/dtos/reqeusts/forms-request.dto';
import { FormsDetailRequestDto } from '../../../../forms/controllers/dtos/reqeusts/forms-detail-request.dto';

export class PagesEditRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 폰트 설정' })
  font: PagesFontRequestDto;

  @IsNotEmpty()
  @ApiProperty({ description: '폼 설정' })
  form: FormsRequestDto;

  @IsNotEmpty()
  @ApiProperty({ description: '폼 질문 설정' })
  formDetail: FormsDetailRequestDto[];
}
