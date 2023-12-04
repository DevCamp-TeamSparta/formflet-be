import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class DomainsRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '도메인' })
  customDomain: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '라우팅 대상' })
  value: string;
}
