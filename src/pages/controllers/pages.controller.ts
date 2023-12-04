import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { PagesRequestDto } from '../dto/requests/pages-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { PagesResponseDto } from '../dto/responses/pages-response.dto';

@Controller('pages')
@UseGuards(AuthGuard())
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post('/register')
  async registerPage(
    @GetUser() user: User,
    @Body() pagesRequestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.registerPage(user, pagesRequestDto);
  }
}
