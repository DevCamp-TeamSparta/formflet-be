import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { PagesRequestDto } from './dto/requests/pages-request.dto';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { PagesResponseDto } from './dto/responses/pages-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PagesEditRequestDto } from './dto/requests/pages-edit-request.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@Controller('api/pages')
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Post('/register')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '노션 페이지 등록 API',
    description: '노션 페이지 등록 API',
  })
  async registerPage(
    @GetUser() user: User,
    @Body() requestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.service.registerPage(user, requestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '전체 페이지 조회 API',
    description: '전체 페이지 조회 API',
  })
  async getAllPagesByUserId(@GetUser() user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    return this.service.getAllPagesByUserId(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'id로 페이지 조회 API',
    description: 'id로 페이지 조회 API',
  })
  async getPageByPageId(@GetUser() user: User, @Param('id') id: number): Promise<ResponseEntity<PagesResponseDto>> {
    return this.service.getPageByPageId(user, id);
  }

  @Get('release/:domain')
  @ApiOperation({
    summary: '배포 페이지 조회 API',
    description: '배포 페이지 조회 API',
  })
  async getPageByDomain(@Param('domain') domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    return this.service.getPageByDomain(domain);
  }

  @Patch('edit/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '페이지 편집 적용 API',
    description: '페이지 편집 적용 API',
  })
  async editPage(
    @Param('id') id: number,
    @Body() requestDto: PagesEditRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.service.editPage(id, requestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '특정 노션 페이지 삭제 API',
    description: '특정 노션 페이지 삭제 API',
  })
  async deletePageByPageId(@Param('id') id: number): Promise<ResponseEntity<string>> {
    return this.service.deletePage(id);
  }
}
