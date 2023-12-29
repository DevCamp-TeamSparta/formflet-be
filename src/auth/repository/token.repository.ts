import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class TokenRepository extends Repository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly repository: Repository<Token>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByUserId(userId: number) {
    return this.repository.findOneBy({ userId });
  }
}
