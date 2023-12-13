import { Repository } from 'typeorm';
import { PageBackup } from '../entities/page-backup.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PagesBackupRepository extends Repository<PageBackup> {
  constructor(
    @InjectRepository(PageBackup)
    private readonly repository: Repository<PageBackup>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
