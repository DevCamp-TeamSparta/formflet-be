import { Expose } from 'class-transformer';

export class DomainsResponseDto {
  @Expose()
  private readonly id: number;

  @Expose()
  private readonly url: string;
}
