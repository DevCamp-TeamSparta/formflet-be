import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagesFontRequestDto } from './pages-font-request.dto';
import { FormsRequestDto } from '../../../../forms/controllers/dtos/reqeusts/forms-request.dto';
import { CtasRequestDto } from '../../../../ctas/controllers/dtos/requests/ctas-request.dto';

export class PagesEditRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'notion scrap 내용' })
  content: string;

  @IsNotEmpty()
  @ApiProperty({ description: '페이지 폰트' })
  font: PagesFontRequestDto;

  @IsNotEmpty()
  @ApiProperty({ description: '폼' })
  form: FormsRequestDto;

  @IsNotEmpty()
  @ApiProperty({ description: 'cta' })
  cta: CtasRequestDto;
}
