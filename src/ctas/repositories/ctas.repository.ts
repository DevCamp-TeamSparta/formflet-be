import { Repository } from 'typeorm';
import { Cta } from '../entities/cta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../pages/entities/page.entity';

export class CtasRepository extends Repository<Cta> {
  constructor(
    @InjectRepository(Cta)
    private readonly repository: Repository<Cta>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByPageId(page: Page): Promise<Cta> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }

  async deleteByPageId(page: Page): Promise<void> {
    await this.repository.delete({ page: { id: page.id } });
  }
}
