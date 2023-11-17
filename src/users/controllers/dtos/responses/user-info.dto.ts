import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserInfoDto {
  @Expose()
  private readonly id: number;

  @Expose()
  private readonly email: string;

  @Expose()
  private readonly name: string;

  @Expose()
  private readonly mobile: string;
}
