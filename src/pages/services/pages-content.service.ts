import { Injectable, Logger } from '@nestjs/common';
import { PagesContentRepository } from '../repositories/pages-content.repository';
import { Page } from '../entities/page.entity';
import { PageDetail } from '../entities/page-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesContentService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesContentRepository) {}

  async createPageDetail(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('start createPageDetail');
    const pageDetail: PageDetail = Builder<PageDetail>().page(page).content(content).build();
    await this.repository.save(pageDetail);

    return pageDetail;
  }

  async updatePageDetail(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('start updatePageDetail');

    const pageDetail: PageDetail = await this.repository.findOneBy({ page: { id: page.id } });
    pageDetail.content = content;

    await this.repository.save(pageDetail);

    return pageDetail;
  }
}
