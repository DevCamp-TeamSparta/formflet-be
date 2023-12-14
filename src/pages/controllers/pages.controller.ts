import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { PagesRequestDto } from './dto/requests/pages-request.dto';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { PagesResponseDto } from './dto/responses/pages-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { EditRequestDto } from './dto/requests/edit-request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post('register')
  @UseGuards(AuthGuard())
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

  @Get('release/:domain')
  @ApiOperation({
    summary: '배포 페이지 조회 API',
    description: '배포 페이지 조회 API',
  })
  async getReleasePageByDomain(
    @Param('domain') domain: string,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.getReleasePageByDomain(domain);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '전체 페이지 조회 API',
    description: '전체 페이지 조회 API',
  })
  async getAllPageByUserId(@GetUser() user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    return this.pagesService.getAllPagesByUserId(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'id로 페이지 조회 API',
    description: 'id로 페이지 조회 API',
  })
  async getPageByPageId(@Param('id') id: number): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.getPageByPageId(id);
  }

  @Patch('edit/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '페이지 편집 시 적용한 효과 저장 API',
    description: '페이지 편집 시 적용한 효과 저장 API',
  })
  async editPage(
    @Param('id') id: number,
    @Body() pagesEditRequestDto: EditRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.editPage(id, pagesEditRequestDto);
  }

  @Patch('refresh/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '페이지 새로고침 API',
    description: '페이지 새로고침 API',
  })
  async refreshPage(@Param('id') id: number): Promise<ResponseEntity<PagesResponseDto>> {
    return this.pagesService.refreshPage(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '특정 노션 페이지 삭제 API',
    description: '특정 노션 페이지 삭제 API',
  })
  async deletePageByPageId(@Param('id') id: number): Promise<ResponseEntity<string>> {
    return this.pagesService.deletePage(id);
  }
}
