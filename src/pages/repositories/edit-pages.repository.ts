import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EditPage } from '../entities/edit-pages.entity';

export class EditPagesRepository extends Repository<EditPage> {
  constructor(
    @InjectRepository(EditPage)
    private readonly repository: Repository<EditPage>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
