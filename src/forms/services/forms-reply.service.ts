import { Injectable, Logger } from '@nestjs/common';
import { FormsReplyRepository } from '../repositories/forms-reply.repository';
import { FormReply } from '../entities/forms-reply.entity';
import { FormDetail } from '../entities/forms-detail.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsReplyRequestDto } from '../controllers/dtos/reqeusts/forms-reply-request.dto';
import { Form } from '../entities/forms.entity';
import { FormsService } from './forms.service';
import { Builder } from 'builder-pattern';

@Injectable()
export class FormsReplyService {
  private readonly logger: Logger = new Logger('FormsReplyService');

  constructor(
    private readonly formsService: FormsService,
    private readonly formsReplyRepository: FormsReplyRepository,
  ) {}

  async createFormReply(id: number, requestDto: FormsReplyRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('createFormReply');

    const form: Form = await this.formsService.getFormById(id);

    for (const [i, formDetail] of form.formDetail.entries()) {
      const answer: string = requestDto.answer[i].join(', ');

      const formReply: FormReply = Builder<FormReply>().formDetail(formDetail).answer(answer).build();

      await this.formsReplyRepository.save(formReply);
    }

    return ResponseEntity.OK('답변 작성 완료');
  }

  async getFormReplyStatus(formDetails: FormDetail[]): Promise<boolean> {
    // formDetail 확인
    if (!formDetails || formDetails.length === 0) {
      return false;
    }

    // formReply 조회
    const formReply: FormReply = await this.formsReplyRepository.findByFormDetail(formDetails[0]);

    // 결과 값 return
    return !!formReply;
  }
}
