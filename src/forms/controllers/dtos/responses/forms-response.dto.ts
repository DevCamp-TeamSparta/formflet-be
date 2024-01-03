import { FormDetail } from '../../../entities/forms-detail.entity';

export class FormsResponseDto {
  id: number;
  isConnection: boolean;
  status: boolean;
  replyStatus: boolean;
  title: string;
  guide: string;
  formDetails: FormDetail[];

  constructor(
    id: number,
    isConnection: boolean,
    status: boolean,
    replyStatus: boolean,
    title: string,
    guide: string,
    formDetails: FormDetail[],
  ) {
    this.id = id;
    this.isConnection = isConnection;
    this.status = status;
    this.replyStatus = replyStatus;
    this.title = title;
    this.guide = guide;
    this.formDetails = formDetails;
  }
}
