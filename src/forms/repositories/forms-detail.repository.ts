import { Repository } from 'typeorm';
import { FormDetail } from '../entities/forms-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../entities/forms.entity';

export class FormsDetailRepository extends Repository<FormDetail> {
  constructor(
    @InjectRepository(FormDetail)
    private readonly repository: Repository<FormDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllByForm(form: Form): Promise<FormDetail[]> {
    return await this.repository.findBy({ form: { id: form.id } });
  }
}
