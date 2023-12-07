import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';
import { AuthRequestDto } from './dtos/requests/auth-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '로그인 API', description: '로그인 API' })
  async logIn(
    @Body() requestDto: AuthRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<UsersResponseDto>> {
    return this.authService.logIn(requestDto, res);
  }

  @Delete('/logout')
  @ApiOperation({ summary: '로그아웃 API', description: '로그아웃 API' })
  async logout(@GetUser() user: User): Promise<ResponseEntity<string>> {
    return this.authService.logout(user);
  }
}
