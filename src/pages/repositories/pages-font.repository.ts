import { Repository } from 'typeorm';
import { PageFont } from '../entities/page-font.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PagesFontRepository extends Repository<PageFont> {
  constructor(
    @InjectRepository(PageFont)
    private readonly repository: Repository<PageFont>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
