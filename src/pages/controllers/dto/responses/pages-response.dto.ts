import { PageDetail } from '../../../entities/pages-detail.entity';

export class PagesResponseDto {
  readonly id: number;
  readonly userId: number;
  readonly pageUrl: string;
  readonly pageDetails: PageDetail[];
}
