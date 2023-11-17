import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CheckEmailDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
