import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class TokenRepository extends Repository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository.target, tokenRepository.manager, tokenRepository.queryRunner);
  }
}
