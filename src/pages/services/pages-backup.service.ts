import { Injectable, Logger } from '@nestjs/common';
import { Page } from '../entities/page.entity';
import { PageBackup } from '../entities/page-backup.entity';
import { PagesBackupRepository } from '../repositories/pages-backup.repository';
import { Builder } from 'builder-pattern';

@Injectable()
export class PagesBackupService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: PagesBackupRepository) {}

  async createPageBackup(page: Page, content: string): Promise<PageBackup> {
    this.logger.log('start createPageBackup');

    const pageBackup: PageBackup = Builder<PageBackup>().page(page).content(content).build();
    await this.repository.save(pageBackup);

    return pageBackup;
  }

  async updatePageBackup(page: Page, content: string): Promise<PageBackup> {
    this.logger.log('start updatePageBackup');

    const pageBackup: PageBackup = await this.repository.findByPage(page);
    pageBackup.content = content;

    await this.repository.save(pageBackup);

    return pageBackup;
  }
}
