import { Injectable, Logger } from '@nestjs/common';
import { PagesFontRepository } from '../repositories/pages-font.repository';
import { Page } from '../entities/page.entity';
import { PageFont } from '../entities/page-font.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesFontService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesFontRepository) {}

  async createPageFont(page: Page): Promise<PageFont> {
    this.logger.log('start createPageFont');

    const pageFont: PageFont = Builder<PageFont>().page(page).type('default').build();
    await this.repository.save(pageFont);

    return pageFont;
  }

  async updatePageFont(page: Page, type: string): Promise<PageFont> {
    this.logger.log('start createPageFont');

    const pageFont: PageFont = await this.repository.findOneBy({ page });
    pageFont.type = type;

    await this.repository.save(pageFont);

    return pageFont;
  }
}
