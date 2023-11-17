import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  @IsString()
  mobile: string;
}
