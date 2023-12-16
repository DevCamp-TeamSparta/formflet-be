import { Injectable, Logger } from '@nestjs/common';
import { PagesContentRepository } from '../repositories/pages-content.repository';
import { Page } from '../entities/page.entity';
import { PageDetail } from '../entities/page-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesContentService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesContentRepository) {}

  async createPageContent(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('start createPageContent');

    const pageContent: PageDetail = Builder<PageDetail>().page(page).content(content).build();
    await this.repository.save(pageContent);

    return pageContent;
  }

  async updatePageContent(page: Page, content: string): Promise<PageDetail> {
    this.logger.log('start updatePageContent');

    const pageContent: PageDetail = await this.repository.findOneBy({ page: { id: page.id } });
    pageContent.content = content;

    await this.repository.save(pageContent);

    return pageContent;
  }
}
