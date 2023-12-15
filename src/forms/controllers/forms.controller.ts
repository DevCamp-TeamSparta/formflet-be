import { Controller, Post } from '@nestjs/common';
import { FormsService } from '../services/forms.service';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsReplyService } from '../services/forms-reply.service';
import { FormsReplyRequestDto } from './dtos/reqeusts/forms-reply-request.dto';

@Controller('api/forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsReplyService: FormsReplyService,
  ) {}

  @Post('/answer/:id')
  @ApiOperation({
    summary: '폼 답변 API',
    description: '폼 답변 API',
  })
  async createFormReply(
    id: number,
    requestDtoList: FormsReplyRequestDto[],
  ): Promise<ResponseEntity<string>> {
    return; // this.formsReplyService.createFormReply(id, requestDtoList);
  }
}
