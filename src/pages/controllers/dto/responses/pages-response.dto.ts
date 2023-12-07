import { Exclude, Expose } from 'class-transformer';
import { EditPage } from '../../../entities/edit-pages.entity';

@Exclude()
export class PagesResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly userId: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly customDomain: string;

  @Expose()
  readonly pageUrl: string;

  @Expose()
  readonly editPage: EditPage[];
}
