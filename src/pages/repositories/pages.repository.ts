import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

export class PagesRepository extends Repository<Page> {
  constructor(
    @InjectRepository(Page)
    private readonly repository: Repository<Page>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllByUser(user: User) {
    await this.repository.findBy(user);
  }
}
