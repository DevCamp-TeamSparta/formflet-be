import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class DomainsRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  customDomain: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  value: string;
}
