import { FormsResponseDto } from '../controllers/dtos/responses/forms-response.dto';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';

export class FormsUtils {
  buildFormResponseDto(form: Form, replyStatus: boolean): FormsResponseDto {
    return Builder<FormsResponseDto>()
      .id(form.id)
      .pageConnect(form.pageConnect)
      .status(form.status)
      .replyStatus(replyStatus)
      .title(form.title)
      .guide(form.guide)
      .formDetails(form.formDetail)
      .build();
  }
}
