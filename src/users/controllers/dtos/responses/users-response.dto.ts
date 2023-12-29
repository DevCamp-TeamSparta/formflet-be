import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UsersResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly mobile: string;

  @Expose()
  readonly job: string;
}
