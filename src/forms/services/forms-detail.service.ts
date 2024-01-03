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
    this.logger.log('createFormDetail');

    const matches = this.getQuestion(guide);

    for (const match of matches) {
      const question: string = match[1];

      const formDetail: FormDetail = Builder<FormDetail>().form(form).question(question).build();

      await this.repository.save(formDetail);
    }
  }

  async editFormDetail(form: Form, guide: string): Promise<void> {
    this.logger.log('editFormDetail');

    // formDetail 가져오기
    const formDetails: FormDetail[] = await this.repository.findAllByForm(form);

    // formDetail 유무로 create or update
    !formDetails.length ? await this.createFormDetail(form, guide) : await this.updateFormDetail(form, guide);
  }

  getQuestion(guide: string) {
    return guide.matchAll(/\[질문.*?\] (.*?)\n/g);
  }

  async updateFormDetail(form: Form, guide: string): Promise<void> {
    this.logger.log('updateFormDetail');

    // form guide에서 정규식으로 질문 가져오기
    const matches = this.getQuestion(guide);

    // formDetail 가져오기
    const formDetails: FormDetail[] = await this.repository.findAllByForm(form);

    // formDetails를 기준으로 처리
    for (let i = 0; i < formDetails.length; i++) {
      const formDetail = formDetails[i];

      const match = matches.next();

      if (!match.done) {
        // question 있는지 확인 후 없으면 저장
        formDetail.question = match.value[1];

        // update formDetail 저장
        await this.repository.save(formDetail);
      } else {
        // matches가 더 짧으면 나머지 formDetail 삭제
        await this.repository.delete(formDetail.id);
      }
    }

    // matches가 남아있으면 추가로 저장
    let nextMatch = matches.next();

    while (!nextMatch.done) {
      const newFormDetail = new FormDetail();
      newFormDetail.form = form;
      newFormDetail.question = nextMatch.value[1];

      // 추가로 저장
      await this.repository.save(newFormDetail);

      nextMatch = matches.next();
    }
  }
}
