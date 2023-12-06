import { Repository } from 'typeorm';
import { PageDetail } from '../entities/pages-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PagesDetailRepository extends Repository<PageDetail> {
  constructor(
    @InjectRepository(PageDetail)
    private readonly repository: Repository<PageDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
