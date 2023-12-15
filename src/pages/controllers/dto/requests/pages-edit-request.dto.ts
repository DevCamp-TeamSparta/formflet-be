import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagesFontRequestDto } from './pages-font-request.dto';
import { FormsRequestDto } from '../../../../forms/controllers/dtos/reqeusts/forms-request.dto';

export class PagesEditRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: '페이지 폰트 설정' })
  font: PagesFontRequestDto;

  @IsNotEmpty()
  @ApiProperty({ description: '폼 설정' })
  form: FormsRequestDto;
}
