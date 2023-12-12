import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageContent } from '../entities/page-content.entity';

export class PagesContentRepository extends Repository<PageContent> {
  constructor(
    @InjectRepository(PageContent)
    private readonly repository: Repository<PageContent>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
