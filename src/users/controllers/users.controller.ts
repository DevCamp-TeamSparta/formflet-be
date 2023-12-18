import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JoinRequestDto } from './dtos/requests/join-request.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('/join')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입 API',
  })
  joinUser(@Body(ValidationPipe) createUserDto: JoinRequestDto) {
    return this.service.joinUser(createUserDto);
  }

  @Get('/check-email')
  @ApiOperation({
    summary: '이메일 중복체크 API',
    description: '이메일 중복체크 API',
  })
  checkEmail(@Query('email') email: string) {
    return this.service.checkEmail(email);
  }
}
