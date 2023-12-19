import { Controller, Param, Post } from '@nestjs/common';
import { FormsService } from '../services/forms.service';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsReplyService } from '../services/forms-reply.service';

@Controller('api/forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsReplyService: FormsReplyService,
  ) {}

  @Post('/reply/:domain')
  @ApiOperation({
    summary: '폼 답변 API',
    description: '폼 답변 API',
  })
  async createFormReply(@Param('domain') domain: string): Promise<ResponseEntity<string>> {
    return; // this.formsReplyService.createFormReply(id, requestDtoList);
  }
}
