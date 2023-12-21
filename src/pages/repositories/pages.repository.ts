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
    return await this.repository.findBy({ user: { id: user.id }, forms: { isConnection: true } });
  }

  async findById(id: number): Promise<Page> {
    return await this.repository.findOneBy({ id, forms: { isConnection: true } });
  }

  async findByDomain(domain: string): Promise<Page> {
    return await this.repository.findOneBy({ domain, forms: { isConnection: true } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  /*  async test(userId: number): Promise<Page[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('page')
      .leftJoin(PageDetail, 'pageDetail', 'page.id = pageDetail.pageId')
      .leftJoin(PageFont, 'pageFont', 'page.id = pageFont.pageId')
      .leftJoin(Form, 'form', 'page.id = form.pageId')
      .leftJoin(FormDetail, 'formDetail', 'form.id = formDetail.formId')
      .leftJoin(FormReply, 'formReply', 'formDetail.id = formReply.formDetailId')
      .leftJoin(Cta, 'cta', 'page.id = cta.pageId')
      .select(['page.*', 'pageDetail.*', 'pageFont.*', 'form.*', 'formDetail.*', 'formReply.*', 'cta.*'])
      .where('page.userId = :userId', { userId });

    return await queryBuilder.getRawMany();
  }*/
}
