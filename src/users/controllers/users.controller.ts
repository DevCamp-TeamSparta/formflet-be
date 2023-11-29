import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from './dtos/requests/create-user.dto';
import { UpdateUserDto } from './dtos/requests/update-user.dto';
import { AuthService } from '../../auth/services/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/join')
  joinUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.joinUser(createUserDto);
  }

  @Get('/check-email')
  checkEmail(@Query('email') email: string) {
    console.log(email);
    return this.usersService.checkEmail(email);
  }
}
