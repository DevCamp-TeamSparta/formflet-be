import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class RegisterDomainDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  domain: string;
}
