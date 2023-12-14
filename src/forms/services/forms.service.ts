import { Injectable, Logger } from '@nestjs/common';
import { FormsRepository } from '../repositories/forms.repository';
import { Page } from '../../pages/entities/page.entity';
import { EditRequestDto } from '../../pages/controllers/dto/requests/edit-request.dto';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class FormsService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly formsRepository: FormsRepository) {}

  async createForm(page: Page, editRequestDto: EditRequestDto): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .status(editRequestDto.formStatus)
      .title(editRequestDto.formTitle)
      .description(editRequestDto.formDescription)
      .build();

    return this.formsRepository.save(form);
  }
}
