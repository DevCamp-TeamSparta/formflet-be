import { Injectable, Logger } from '@nestjs/common';
import { FormsDetailRepository } from '../repositories/forms-detail.repository';
import { Form } from '../entities/forms.entity';
import { FormDetail } from '../entities/forms-detail.entity';
import { Builder } from 'builder-pattern';

@Injectable()
export class FormsDetailService {
  private readonly logger: Logger = new Logger('PagesService');
  constructor(private readonly repository: FormsDetailRepository) {}

  async editFormDetail(form: Form, guide: string): Promise<void> {
    this.logger.log('editFormDetail');

    // form guide 에서 정규식으로 질문 가져오기
    const questionMatches = guide.matchAll(/\[질문.*?\] (.*?)\n/g);

    // formDetail 가져오기
    const formDetailList: FormDetail[] = await this.repository.findAllByForm(form);

    // formDetail 없으면 create
    if (!formDetailList.length) {
      for (const match of questionMatches) {
        const question: string = match[1];

        const formDetail: FormDetail = Builder<FormDetail>().form(form).question(question).build();

        await this.repository.save(formDetail);
      }
    }

    // formDetail 있으면 update
    for (const formDetail of formDetailList) {
      const match = questionMatches.next();

      if (!match.done) {
        // question 있는지 확인 후 없으면 저장
        formDetail.question = match.value[1];

        // update formDetail 저장
        await this.repository.save(formDetail);
      }
    }
  }

  async createFormDetail(form: Form, guide: string): Promise<void> {
    const questionMatches = guide.matchAll(/\[질문.*?\] (.*?)\n/g);
    for (const match of questionMatches) {
      const question: string = match[1];

      const formDetail: FormDetail = Builder<FormDetail>().form(form).question(question).build();

      await this.repository.save(formDetail);
    }
  }

  async updateFormDetail(form: Form, guide: string): Promise<void> {
    // form guide 에서 정규식으로 질문 가져오기
    const questionMatches = guide.matchAll(/\[질문.*?\] (.*?)\n/g);

    // formDetail 가져오기
    const formDetailList: FormDetail[] = await this.repository.findAllByForm(form);

    for (const formDetail of formDetailList) {
      const match = questionMatches.next();

      if (!match.done) {
        // question 있는지 확인 후 없으면 저장
        formDetail.question = match.value[1];

        // update formDetail 저장
        await this.repository.save(formDetail);
      }
    }
  }
}
