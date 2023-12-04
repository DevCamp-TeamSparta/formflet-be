import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../../users/controllers/dtos/requests/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfoDto } from '../../users/controllers/dtos/responses/user-info.dto';
import { GetUser } from '../decorator/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  logIn(@Body() signInUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.logIn(signInUserDto, res);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: UserInfoDto) {
    console.log(user);
  }
}
