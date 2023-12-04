import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PagesRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '노선 URL' })
  notionUrl: string;
}
