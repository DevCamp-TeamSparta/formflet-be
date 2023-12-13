import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { PageBackup } from '../entities/page-backup.entity';
import { PageContent } from '../entities/page-content.entity';
import { Builder } from 'builder-pattern';
import { PageFont } from '../entities/page-font.entity';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesUtil } from '../utills/pages.util';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesUtil: PagesUtil,
    private readonly pagesRepository: PagesRepository,
  ) {}

  async registerPage(
    user: User,
    requestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${requestDto.title}`);
    this.logger.log(`domain: ${requestDto.domain}`);
    this.logger.log(`url: ${requestDto.url}`);

    await this.checkDomain(requestDto.domain);

    const content: string = await this.pagesUtil.scrapNotionPage(requestDto.url);

    const pageBackup: PageBackup = Builder<PageBackup>().content(content).build();
    const pageContent: PageContent = Builder<PageContent>().content(content).build();
    const pageFont: PageFont = Builder<PageFont>().type('default').build();

    const page: Page = Builder<Page>()
      .userId(user.id)
      .title(requestDto.title)
      .domain(requestDto.domain)
      .url(requestDto.url)
      .pageBackup(pageBackup)
      .pageContent(pageContent)
      .pageFont(pageFont)
      .build();

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 저장 완료', pagesResponseDto);
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    try {
      const pageList: Page[] = await this.pagesRepository.findAllByUserId(user);
      const pagesResponseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const pagesResponseDto: PagesResponseDto =
          this.pagesUtil.buildPagesResponseDto(page);

        pagesResponseDtoList.push(pagesResponseDto);
      }

      return ResponseEntity.OK_WITH_DATA(
        '전체 노션 페이지 조회 성공',
        pagesResponseDtoList,
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    try {
      const page: Page = await this.pagesRepository.findOneBy({ id });
      const pagesResponseDto: PagesResponseDto =
        this.pagesUtil.buildPagesResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('특정 노션 페이지 조회 성공', pagesResponseDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByDomain(domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    try {
      const page: Page = await this.pagesRepository.findOneBy({ domain });
      const pagesResponseDto: PagesResponseDto =
        this.pagesUtil.buildPagesResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('조회 성공', pagesResponseDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async editPage(
    id: number,
    pagesEditRequestDto: PagesEditRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });

    page.pageFont.type = pagesEditRequestDto.type;

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집 완료', pagesResponseDto);
  }

  async refreshPage(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });

    const content: string = await this.pagesUtil.scrapNotionPage(page.url);

    page.pageBackup.content = content;
    page.pageContent.content = content;
    page.pageFont.type = 'default';

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('페이지 새로고침 완료', pagesResponseDto);
  }

  async deletePage(id: number): Promise<ResponseEntity<string>> {
    await this.pagesRepository.delete({ id });

    return ResponseEntity.OK('페이지 삭제 완료');
  }

  async checkDomain(domain: string): Promise<void> {
    const page: Page = await this.pagesRepository.findByDomain(domain);

    if (page) {
      throw new ConflictException('이미 존재하는 도메인 입니다.');
    }
  }
}
