import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 API',
  })
  async logIn(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<UsersResponseDto>> {
    return this.authService.logIn(requestDto, res);
  }
}
