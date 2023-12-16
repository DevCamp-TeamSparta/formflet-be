import { Injectable, Logger } from '@nestjs/common';
import { FormsRepository } from '../repositories/forms.repository';
import { Page } from '../../pages/entities/page.entity';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';
import { FormsRequestDto } from '../controllers/dtos/reqeusts/forms-request.dto';

@Injectable()
export class FormsService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: FormsRepository) {}

  async createForm(page: Page, requestDto: FormsRequestDto): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .status(requestDto.status)
      .guide(requestDto.guide)
      .build();

    return await this.repository.save(form);
  }

  async getFormByPage(page: Page): Promise<Form> {
    return await this.repository.findOneBy({ page: { id: page.id } });
  }

  async updateForm(page: Page, requestDto: FormsRequestDto) {
    const form: Form = await this.getFormByPage(page);

    form.status = requestDto.status;
    form.guide = requestDto.guide;

    await this.repository.save(form);
  }

  async deleteAllFormByPageId(page: Page) {
    await this.repository.delete({ page: { id: page.id } });
  }
}
