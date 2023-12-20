import { PageDetail } from '../../../entities/page-detail.entity';
import { PageFont } from '../../../entities/page-font.entity';
import { Cta } from '../../../../ctas/entities/cta.entity';
import { Page } from '../../../entities/page.entity';
import { Builder } from 'builder-pattern';
import { FormsResponseDto } from '../../../../forms/controllers/dtos/responses/forms-response.dto';

export class PagesResponseDto {
  readonly id: number;
  readonly title: string;
  readonly domain: string;
  readonly url: string;
  readonly pageDetail: PageDetail;
  readonly pageFont: PageFont;
  readonly form: FormsResponseDto;
  readonly cta: Cta;

  constructor(
    id: number,
    title: string,
    domain: string,
    url: string,
    pageDetail: PageDetail,
    pageFont: PageFont,
    form: FormsResponseDto,
    cta: Cta,
  ) {
    this.id = id;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageDetail = pageDetail;
    this.pageFont = pageFont;
    this.form = form;
    this.cta = cta;
  }

  buildResponseDto(page: Page, responseDto: FormsResponseDto): PagesResponseDto {
    return Builder<PagesResponseDto>()
      .id(page.id)
      .title(page.title)
      .domain(`${page.domain}.${process.env.DOMAIN}`)
      .url(page.url)
      .pageDetail(
        page.pageDetail && {
          ...page.pageDetail,
          content: decodeURIComponent(page.pageDetail.content),
        },
      )
      .pageFont(page.pageFont)
      .form(responseDto)
      .cta(page.cta)
      .build();
  }
}
