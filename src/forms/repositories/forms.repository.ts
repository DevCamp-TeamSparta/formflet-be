import { Repository } from 'typeorm';
import { Form } from '../entities/forms.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class FormsRepository extends Repository<Form> {
  constructor(
    @InjectRepository(Form)
    private readonly repository: Repository<Form>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
