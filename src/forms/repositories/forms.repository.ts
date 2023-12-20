import { Repository } from 'typeorm';
import { Form } from '../entities/forms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../pages/entities/page.entity';

export class FormsRepository extends Repository<Form> {
  constructor(
    @InjectRepository(Form)
    private readonly repository: Repository<Form>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findById(id: number): Promise<Form> {
    return await this.repository.findOneBy({ id });
  }

  async findByPage(page: Page): Promise<Form> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }

  async findAllByPage(page: Page): Promise<Form[]> {
    return await this.repository.findBy({ page: { id: page.id } });
  }
}
