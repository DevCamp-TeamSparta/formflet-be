import { Repository } from 'typeorm';
import { FormReply } from '../entities/forms-reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FormDetail } from '../entities/forms-detail.entity';

export class FormsReplyRepository extends Repository<FormReply> {
  constructor(
    @InjectRepository(FormReply)
    private readonly repository: Repository<FormReply>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByFormDetail(formDetail: FormDetail): Promise<FormReply> {
    return this.repository.findOneBy({ formDetail: { id: formDetail.id } });
  }
}
