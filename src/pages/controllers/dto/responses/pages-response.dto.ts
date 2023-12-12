import { PageContent } from '../../../entities/page-content.entity';
import { FontStyle } from '../../../entities/font-style.entity';

export class PagesResponseDto {
  readonly id: number;
  readonly userId: number;
  readonly title: string;
  readonly customDomain: string;
  readonly pageUrl: string;
  readonly pageContent: PageContent;
  readonly fontStyle: FontStyle;

  constructor(
    id: number,
    userId: number,
    title: string,
    customDomain: string,
    pageUrl: string,
    pageContent: PageContent,
    pageFont: FontStyle,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.customDomain = customDomain;
    this.pageUrl = pageUrl;
    this.pageContent = pageContent;
    this.fontStyle = pageFont;
  }
}
