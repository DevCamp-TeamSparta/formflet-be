import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsReplyService } from '../services/forms-reply.service';
import { FormsReplyRequestDto } from './dtos/reqeusts/forms-reply-request.dto';

@Controller('api/forms')
export class FormsController {
  constructor(private readonly service: FormsReplyService) {}

  @Post('/reply/:id')
  @ApiOperation({
    summary: '폼 답변 API',
    description: '폼 답변 API',
  })
  async createFormReply(
    @Param('id') id: number,
    @Body() requestDto: FormsReplyRequestDto,
  ): Promise<ResponseEntity<string>> {
    return this.service.createFormReply(id, requestDto);
  }
}
