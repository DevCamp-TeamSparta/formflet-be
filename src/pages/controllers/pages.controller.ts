import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { PagesRequestDto } from './dto/requests/pages-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { PagesResponseDto } from './dto/responses/pages-response.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/pages')
@UseGuards(AuthGuard())
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post('/register')
  @ApiOperation({
    summary: '노션 페이지 등록 API',
    description: '노션 페이지 등록 API',
  })
  async registerPage(
    @GetUser() user: User,
    @Body() pagesRequestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.registerPage(user, pagesRequestDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 노션 페이지 조회 API',
    description: '전체 노션 페이지 조회 API',
  })
  async getAllPageByUserId(@GetUser() user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    return this.pagesService.getAllPageByUserId(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 노션 페이지 조회 API',
    description: '특정 노션 페이지 조회 API',
  })
  async getPageByPageId(@Param('id') id: number): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.getPageByPageId(id);
  }
}
