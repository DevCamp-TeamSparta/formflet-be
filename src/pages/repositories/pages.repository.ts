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

  async findAllByUserId(user: User): Promise<Page[]> {
    return await this.repository.findBy({ userId: user.id });
  }
}
