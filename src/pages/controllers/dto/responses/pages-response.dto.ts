import { PageDetail } from '../../../entities/page-detail.entity';
import { PageFont } from '../../../entities/page-font.entity';
import { Form } from '../../../../forms/entities/forms.entity';
import { Cta } from '../../../../ctas/entities/cta.entity';

export class PagesResponseDto {
  readonly id: number;
  readonly title: string;
  readonly domain: string;
  readonly url: string;
  readonly pageContent: PageDetail;
  readonly pageFont: PageFont;
  readonly form: Form;
  readonly cta: Cta;

  constructor(
    id: number,
    title: string,
    domain: string,
    url: string,
    pageContent: PageDetail,
    pageFont: PageFont,
    form: Form,
    cta: Cta,
  ) {
    this.id = id;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageContent = pageContent;
    this.pageFont = pageFont;
    this.form = form;
    this.cta = cta;
  }
}
