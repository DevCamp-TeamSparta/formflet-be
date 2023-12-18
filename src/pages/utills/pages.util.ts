import { Logger } from '@nestjs/common';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';



export class PagesUtil {
  private readonly logger: Logger = new Logger('PagesUtil');

  buildPagesResponseDto(page: Page): PagesResponseDto {
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
      .form(page.form)
      .cta(page.cta)
      .build();
  }
}
