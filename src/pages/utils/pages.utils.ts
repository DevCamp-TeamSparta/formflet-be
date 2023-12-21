import { Page } from '../entities/page.entity';
import { FormsResponseDto } from '../../forms/controllers/dtos/responses/forms-response.dto';
import { Builder } from 'builder-pattern';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';

export class PagesUtils {
  buildPageResponseDto(page: Page, formsResponseDtos: FormsResponseDto[]): PagesResponseDto {
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
      .form(formsResponseDtos)
      .cta(page.cta)
      .build();
  }
}
