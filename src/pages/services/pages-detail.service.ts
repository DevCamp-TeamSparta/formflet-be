import { Injectable, Logger } from '@nestjs/common';
import { PagesDetailRepository } from '../repositories/pages-detail.repository';
import { Page } from '../entities/page.entity';
import { PageDetail } from '../entities/page-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesDetailService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesDetailRepository) {}

  async createPageDetail(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('createPageDetail');

    content = encodeURIComponent(content);

    const pageDetail: PageDetail = Builder<PageDetail>().page(page).content(content).build();
    await this.repository.save(pageDetail);

    return pageDetail;
  }

  async updatePageDetail(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('updatePageDetail');

    content = encodeURIComponent(content);

    const pageDetail: PageDetail = await this.repository.findByPage(page);

    pageDetail.content = content;

    await this.repository.save(pageDetail);

    return pageDetail;
  }
}
