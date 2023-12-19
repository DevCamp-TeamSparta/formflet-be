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

  async findByDomain(domain: string): Promise<Page> {
    return await this.repository.findOneBy({ domain });
  }

  async findById(id: number): Promise<Page> {
    return await this.repository.findOneBy({ id });
  }

  async findAllByUser(user: User): Promise<Page[]> {
    return await this.repository.findBy({ user: { id: user.id } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
