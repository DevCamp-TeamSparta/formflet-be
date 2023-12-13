import { Repository } from 'typeorm';
import { PageContent } from '../entities/page-content.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PagesContentRepository extends Repository<PageContent> {
  constructor(
    @InjectRepository(PageContent)
    private readonly repository: Repository<PageContent>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
