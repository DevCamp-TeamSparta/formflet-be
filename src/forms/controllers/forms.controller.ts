import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsReplyService } from '../services/forms-reply.service';
import { FormsReplyRequestDto } from './dtos/reqeusts/forms-reply-request.dto';
import { FormsResponseDto } from './dtos/responses/forms-response.dto';
import { FormsService } from '../services/forms.service';

@Controller('api/forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsReplyService: FormsReplyService,
  ) {}

  @Get('/:pageId')
  @ApiOperation({
    summary: '폼 전체조회 API',
    description: '폼 전체조회 API',
  })
  async getAllFormsByPageId(@Param('pageId') pageId: number): Promise<ResponseEntity<FormsResponseDto[]>> {
    return this.formsService.getAllFormsByPageId(pageId);
  }

  @Post('/reply/:id')
  @ApiOperation({
    summary: '폼 답변 API',
    description: '폼 답변 API',
  })
  async createFormReply(
    @Param('id') id: number,
    @Body() requestDto: FormsReplyRequestDto,
  ): Promise<ResponseEntity<string>> {
    return this.formsReplyService.createFormReply(id, requestDto);
  }
}
