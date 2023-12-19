import { Repository } from 'typeorm';
import { PageDetail } from '../entities/page-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';

export class PagesDetailRepository extends Repository<PageDetail> {
  constructor(
    @InjectRepository(PageDetail)
    private readonly repository: Repository<PageDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByPage(page: Page): Promise<PageDetail> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }
}
