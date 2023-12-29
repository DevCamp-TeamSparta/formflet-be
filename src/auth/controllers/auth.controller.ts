import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequestDto } from './dtos/requests/auth-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '로그인 API', description: '로그인 API' })
  async logIn(
    @Body() requestDto: AuthRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<{ accessToken: string }>> {
    return this.service.logIn(requestDto, res);
  }

  @Post('/reissue')
  @ApiOperation({ summary: 'token 재발행 API', description: 'token 재발행 API' })
  async reissue(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<{ accessToken: string }>> {
    return this.service.reissue(req);
  }

  @Delete('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그아웃 API', description: '로그아웃 API' })
  async logout(@GetUser() user: User): Promise<ResponseEntity<string>> {
    return this.service.logout(user);
  }
}
