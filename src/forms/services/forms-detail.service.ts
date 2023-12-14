import { Injectable, Logger } from '@nestjs/common';
import { FormsDetailRepository } from '../repositories/forms-detail.repository';
import { Form } from '../entities/forms.entity';
import { FormsDetailRequestDto } from '../controllers/dtos/reqeusts/forms-detail-request.dto';
import { FormDetail } from '../entities/forms-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class FormsDetailService {
  private readonly logger: Logger = new Logger('PagesService');
  constructor(private readonly repository: FormsDetailRepository) {}

  async createFormDetail(form: Form, requestDtoList: FormsDetailRequestDto[]): Promise<void> {
    for (const requestDto of requestDtoList) {
      const formDetail: FormDetail = Builder<FormDetail>()
        .form(form)
        .title(requestDto.title)
        .type(requestDto.type)
        .content(requestDto.content)
        .build();

      await this.repository.save(formDetail);
    }
  }
}
