import { Repository } from 'typeorm';
import { FormReply } from '../entities/forms-reply.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class FormsReplyRepository extends Repository<FormReply> {
  constructor(
    @InjectRepository(FormReply)
    private readonly repository: Repository<FormReply>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
