import { OriginalPage } from '../../../entities/original-pages.entity';

export class PagesResponseDto {
  readonly id: number;
  readonly userId: number;
  readonly pageUrl: string;
  readonly pageDetails: OriginalPage[];
}
