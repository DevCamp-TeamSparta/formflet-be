import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JoinRequestDto } from './dtos/requests/join-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/join')
  joinUser(@Body(ValidationPipe) createUserDto: JoinRequestDto) {
    return this.usersService.joinUser(createUserDto);
  }

  @Get('/check-email')
  checkEmail(@Query('email') email: string) {
    console.log(email);
    return this.usersService.checkEmail(email);
  }
}
