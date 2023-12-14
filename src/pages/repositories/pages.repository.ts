import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PagesRepository extends Repository<Page> {
  constructor(
    @InjectRepository(Page)
    private readonly repository: Repository<Page>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
