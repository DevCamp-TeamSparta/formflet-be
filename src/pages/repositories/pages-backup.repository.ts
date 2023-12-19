import { Repository } from 'typeorm';
import { PageBackup } from '../entities/page-backup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';

export class PagesBackupRepository extends Repository<PageBackup> {
  constructor(
    @InjectRepository(PageBackup)
    private readonly repository: Repository<PageBackup>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByPage(page: Page): Promise<PageBackup> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }
}
