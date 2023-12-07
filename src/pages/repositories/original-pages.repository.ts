import { Repository } from 'typeorm';
import { OriginalPage } from '../entities/original-pages.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class OriginalPagesRepository extends Repository<OriginalPage> {
  constructor(
    @InjectRepository(OriginalPage)
    private readonly repository: Repository<OriginalPage>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
