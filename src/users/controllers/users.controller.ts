import { Body, Controller, Post, Put, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JoinRequestDto } from './dtos/requests/join-request.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { VerifyEmailRequestDto } from './dtos/requests/verify-email-request.dto';
import { VerifyCodeRequestDto } from './dtos/requests/verify-code-request.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('/join')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입 API',
  })
  joinUser(@Body(ValidationPipe) requestDto: JoinRequestDto) {
    return this.service.joinUser(requestDto);
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'email 인증 API', description: 'email 인증 API' })
  async verifyEmail(@Body() requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    return this.service.verifyEmail(requestDto);
  }

  @Put('/verify-code')
  @ApiOperation({ summary: 'email 인증 API', description: 'email 인증 API' })
  async verifyCode(@Body() requestDto: VerifyCodeRequestDto): Promise<ResponseEntity<string>> {
    return this.service.verifyCode(requestDto);
  }
}
