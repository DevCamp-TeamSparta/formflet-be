import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/pages.entity';
import { plainToInstance } from 'class-transformer';
import { PagesDetailRepository } from '../repositories/pages-detail.repository';
import { PageDetail } from '../entities/pages-detail.entity';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly pagesDetailRepository: PagesDetailRepository,
  ) {}
  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    const userId: number = user.id;
    const pageUrl: string = requestDto.pageUrl;

    this.logger.log(`userId: ${userId}`);
    this.logger.log(`pageUrl: ${pageUrl}`);
    this.logger.log(`content: ${requestDto.content}`);

    const page: Page = this.pagesRepository.create({ userId, pageUrl });

    try {
      await this.pagesRepository.save(page);

      return this.registerPageDetail(page, requestDto);
    } catch (e) {
      throw new InternalServerErrorException('페이지 URL 저장 오류');
    }
  }

  async registerPageDetail(page: Page, requestDto: PagesRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    const content: string = requestDto.content;

    const pageDetail: PageDetail = this.pagesDetailRepository.create({ page, content });

    try {
      await this.pagesDetailRepository.save(pageDetail);

      const resultPage = await this.pagesRepository.findOneBy({ id: page.id });

      const data: PagesResponseDto = plainToInstance(PagesResponseDto, resultPage);

      return ResponseEntity.OK_WITH_DATA('노션 페이지 저장 완료', data);
    } catch (e) {
      throw new InternalServerErrorException('스크래핑 데이터 저장 오류');
    }
  }

  async getPageByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    try {
      const page: Page[] = await this.pagesRepository.findAllByUserId(user);

      const data: PagesResponseDto[] = plainToInstance(PagesResponseDto, page);

      return ResponseEntity.OK_WITH_DATA('저장된 노션 페이지 불러오기 성공', data);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
