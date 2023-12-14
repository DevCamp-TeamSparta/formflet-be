import { Injectable, Logger } from '@nestjs/common';
import { PagesContentRepository } from '../repositories/pages-content.repository';
import { Page } from '../entities/page.entity';
import { PageContent } from '../entities/page-content.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesContentService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesContentRepository) {}

  async createPageContent(page: Page, content: string): Promise<PageContent> {
    this.logger.log('start createPageContent');

    const pageContent: PageContent = Builder<PageContent>().page(page).content(content).build();
    await this.repository.save(pageContent);

    return pageContent;
  }

  async updatePageContent(page: Page, content: string): Promise<PageContent> {
    this.logger.log('start updatePageContent');

    const pageContent: PageContent = await this.repository.findOneBy({ page });
    pageContent.content = content;

    await this.repository.save(pageContent);

    return pageContent;
  }
}
