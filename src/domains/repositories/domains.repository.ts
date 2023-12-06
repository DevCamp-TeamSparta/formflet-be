import { Repository } from 'typeorm';
import { Domain } from '../entites/domains.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class DomainsRepository extends Repository<Domain> {
  constructor(
    @InjectRepository(Domain)
    private readonly domainsRepository: Repository<Domain>,
  ) {
    super(domainsRepository.target, domainsRepository.manager, domainsRepository.queryRunner);
  }
}
