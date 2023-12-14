import { Repository } from 'typeorm';
import { FormDetail } from '../entities/forms-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class FormsDetailRepository extends Repository<FormDetail> {
  constructor(
    @InjectRepository(FormDetail)
    private readonly repository: Repository<FormDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
