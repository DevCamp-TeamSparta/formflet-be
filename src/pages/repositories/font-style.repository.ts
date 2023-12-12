import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FontStyle } from '../entities/font-style.entity';

export class FontStyleRepository extends Repository<FontStyle> {
  constructor(
    @InjectRepository(FontStyle)
    private readonly repository: Repository<FontStyle>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
