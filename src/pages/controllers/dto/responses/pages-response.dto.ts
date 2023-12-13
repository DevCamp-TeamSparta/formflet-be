import { PageContent } from '../../../entities/page-content.entity';
import { PageFont } from '../../../entities/page-font.entity';

export class PagesResponseDto {
  readonly id: number;
  readonly userId: number;
  readonly title: string;
  readonly domain: string;
  readonly url: string;
  readonly pageContent: PageContent;
  readonly pageFont: PageFont;

  constructor(
    id: number,
    userId: number,
    title: string,
    domain: string,
    url: string,
    pageContent: PageContent,
    pageFont: PageFont,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageContent = pageContent;
    this.pageFont = pageFont;
  }
}
