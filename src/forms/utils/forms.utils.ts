import { FormsResponseDto } from '../controllers/dtos/responses/forms-response.dto';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';

export class FormsUtils {
  buildFormsResponseDto(form: Form, replyStatus: boolean): FormsResponseDto {
    return Builder<FormsResponseDto>()
      .id(form.id)
      .status(form.status)
      .replyStatus(replyStatus)
      .guide(form.guide)
      .formDetail(form.formDetail)
      .build();
  }
}
