import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from './dtos/requests/create-user.dto';
import { UpdateUserDto } from './dtos/requests/update-user.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from './dtos/requests/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @Get('/checkemail')
  checkEmail(@Query('email') email: string) {
    console.log(email);
    return this.usersService.checkEmail(email);
  }

  @Post('/login')
  logIn(@Body() signInUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.logIn(signInUserDto, res);
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
