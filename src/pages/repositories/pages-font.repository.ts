import { Repository } from 'typeorm';
import { PageFont } from '../entities/page-font.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';

export class PagesFontRepository extends Repository<PageFont> {
  constructor(
    @InjectRepository(PageFont)
    private readonly repository: Repository<PageFont>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByPage(page: Page): Promise<PageFont> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }
}
