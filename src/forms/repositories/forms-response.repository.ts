import { Repository } from 'typeorm';
import { FormResponse } from '../entities/forms-response.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class FormsResponseRepository extends Repository<FormResponse> {
  constructor(
    @InjectRepository(FormResponse)
    private readonly repository: Repository<FormResponse>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
