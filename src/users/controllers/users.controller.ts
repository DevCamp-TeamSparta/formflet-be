import { Body, Controller, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JoinRequestDto } from './dtos/requests/join-request.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../../configs/response-entity';
import { UsersResponseDto } from './dtos/responses/users-response.dto';
import { PasswordRequestDto } from './dtos/requests/password-request.dto';
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
  async joinUser(@Body(ValidationPipe) requestDto: JoinRequestDto): Promise<ResponseEntity<UsersResponseDto>> {
    return this.service.joinUser(requestDto);
  }

  @Post('/join/verify-email')
  @ApiOperation({ summary: '회원가입 email 인증 API', description: '회원가입 email 인증 API' })
  async verifyEmailForJoin(@Body() requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    return this.service.verifyEmailForJoin(requestDto);
  }

  @Patch('/password/reset')
  @ApiOperation({
    summary: '비밀번호 재설정 API',
    description: '비밀번호 재설정 API',
  })
  async resetPassword(@Body() requestDto: PasswordRequestDto): Promise<ResponseEntity<string>> {
    return this.service.resetPassword(requestDto);
  }

  @Post('/password/verify-email')
  @ApiOperation({ summary: '비밀번호 재설정 email 인증 API', description: '비밀번호 재설정 email 인증 API' })
  async verifyEmailForPasswordReset(@Body() requestDto: VerifyEmailRequestDto): Promise<ResponseEntity<string>> {
    return this.service.verifyEmailForPasswordReset(requestDto);
  }

  @Put('/verify-code')
  @ApiOperation({ summary: 'email code 인증 API', description: 'email code 인증 API' })
  async verifyCode(@Body() requestDto: VerifyCodeRequestDto): Promise<ResponseEntity<string>> {
    return this.service.verifyEmailCode(requestDto);
  }
}
