import { Injectable, Logger } from '@nestjs/common';
import { FormsRepository } from '../repositories/forms.repository';
import { Page } from '../../pages/entities/page.entity';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';
import { FormsRequestDto } from '../controllers/dtos/reqeusts/forms-request.dto';

@Injectable()
export class FormsService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly formsRepository: FormsRepository) {}

  async createForm(page: Page, requestDto: FormsRequestDto): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .status(requestDto.status)
      .title(requestDto.title)
      .description(requestDto.description)
      .guide(requestDto.guide)
      .build();

    return await this.formsRepository.save(form);
  }
}
