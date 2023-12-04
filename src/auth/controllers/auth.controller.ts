import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { ResponseEntity } from '../../configs/response-entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async logIn(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<UsersResponseDto>> {
    return this.authService.logIn(requestDto, res);
  }
}
