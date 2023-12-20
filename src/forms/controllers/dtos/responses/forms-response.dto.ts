import { FormDetail } from '../../../entities/forms-detail.entity';

export class FormsResponseDto {
  id: number;
  status: boolean;
  replyStatus: boolean;
  guide: string;
  formDetail: FormDetail[];

  constructor(id: number, status: boolean, replyStatus: boolean, guide: string, formDetail: FormDetail[]) {
    this.id = id;
    this.status = status;
    this.replyStatus = replyStatus;
    this.guide = guide;
    this.formDetail = formDetail;
  }
}
