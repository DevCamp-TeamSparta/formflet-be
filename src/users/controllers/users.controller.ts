import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from './dtos/requests/create-user.dto';
import { UpdateUserDto } from './dtos/requests/update-user.dto';
import { AuthService } from '../../auth/services/auth.service';
import { LoginUserDto } from './dtos/requests/login-user.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
