import { Injectable, Logger } from '@nestjs/common';
import { FormsDetailRepository } from '../repositories/forms-detail.repository';
import { Form } from '../entities/forms.entity';
import { FormDetail } from '../entities/forms-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class FormsDetailService {
  private readonly logger: Logger = new Logger('PagesService');
  constructor(private readonly repository: FormsDetailRepository) {}

  async createFormDetail(form: Form, guide: string): Promise<void> {
    const questionMatches = guide.matchAll(/\[질문.*?\] (.*?)\n/g);
    for (const match of questionMatches) {
      const question: string = match[1];

      const formDetail: FormDetail = Builder<FormDetail>().form(form).question(question).build();

      await this.repository.save(formDetail);
    }
  }

  async updateFormDetail(form: Form, guide: string): Promise<void> {
    const questionMatches = guide.matchAll(/\[질문.*?\] (.*?)\n/g);

    const formDetailList: FormDetail[] = await this.repository.findBy({ form: { id: form.id } });

    for (const formDetail of formDetailList) {
      const match = questionMatches.next();

      if (!match.done) {
        // 'formDetail' 에 'question' 속성이 있는지 확인하고, 없다면 추가해주세요.
        formDetail.question = match.value[1];

        // 데이터베이스에 수정된 'formDetail' 을 저장합니다.
        await this.repository.save(formDetail);
      }
    }
  }
}
