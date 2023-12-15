import { Injectable } from '@nestjs/common';
import { FormsReplyRepository } from '../repositories/forms-reply.repository';
import { FormsDetailRepository } from '../repositories/forms-detail.repository';

@Injectable()
export class FormsReplyService {
  constructor(
    private readonly formsDetailRepository: FormsDetailRepository,
    private readonly formsReplyRepository: FormsReplyRepository,
  ) {}

  // async createFormReply(id: number, requestDtoList: FormsReplyRequestDto[]): Promise<ResponseEntity<string>> {
  //   const formDetail: FormDetail = await this.formsDetailRepository.findOneBy({ id });
  //
  //   for(const requestDto:FormsReplyRequestDto of requestDtoList) {
  //   const formReply: FormReply = Builder<FormReply>()
  //     .formDetail(formDetail)
  //     .answer(requestDto.)
  //     .build();
  //
  //   await this.formsReplyRepository.save(formReply);
  //   }
  //
  //   return ResponseEntity.OK('답변 작성 완료');
  // }
}
