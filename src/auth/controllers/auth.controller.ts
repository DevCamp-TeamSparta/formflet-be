import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../../users/controllers/dtos/requests/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  logIn(@Body() signInUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.logIn(signInUserDto, res);
  }
}
