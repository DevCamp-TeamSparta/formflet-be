import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesUtil } from '../utills/pages.util';
import { PagesBackupService } from './pages-backup.service';
import { PagesContentService } from './pages-content.service';
import { PagesFontService } from './pages-font.service';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly pagesUtil: PagesUtil,
    private readonly pagesBackupService: PagesBackupService,
    private readonly pagesContentService: PagesContentService,
    private readonly pagesFontService: PagesFontService,
  ) {}

  async registerPage(
    user: User,
    pagesRequestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${pagesRequestDto.title}`);
    this.logger.log(`domain: ${pagesRequestDto.domain}`);
    this.logger.log(`url: ${pagesRequestDto.url}`);

    // domain 중복 검사
    await this.checkDomain(pagesRequestDto.domain);

    // page 생성
    const page: Page = Builder<Page>()
      .user(user)
      .title(pagesRequestDto.title)
      .domain(pagesRequestDto.domain)
      .url(pagesRequestDto.url)
      .build();

    // page 저장
    await this.pagesRepository.save(page);

    // scrapping 시작
    const content: string = await this.pagesUtil.scrapNotionPage(pagesRequestDto.url);

    // scrapping data 생성
    await this.pagesContentService.createPageContent(page, content);
    // Notion 수정사항 반영 여부를 위한 scrapping data backup 생성
    await this.pagesBackupService.createPageBackup(page, content);
    // default pageFont 생성
    await this.pagesFontService.createPageFont(page);

    const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 등록', responseDto);
  }

  async getReleasePageByDomain(domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    // domain 으로 page 조회
    const page: Page = await this.pagesRepository.findOneBy({ domain });

    try {
      const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);
      return ResponseEntity.OK_WITH_DATA('배포 페이지 조회', responseDto);
    } catch (e) {
      throw new NotFoundException('존재하지 않는 도메인');
    }
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    const pageList: Page[] = await this.pagesRepository.findBy({ user });

    try {
      const responseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);
        responseDtoList.push(responseDto);
      }

      return ResponseEntity.OK_WITH_DATA('나의 웹페이지 전체조회', responseDtoList);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    try {
      const page: Page = await this.pagesRepository.findOneBy({ id });
      const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('나의 웹페이지 id로 조회', responseDto);
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

    const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집 완료', responseDto);
  }

  async refreshPage(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });

    const content: string = await this.pagesUtil.scrapNotionPage(page.url);

    await this.pagesBackupService.updatePageBackup(page, content);
    await this.pagesContentService.updatePageContent(page, content);
    await this.pagesFontService.updatePageFont(page, 'default');

    await this.pagesRepository.save(page);

    const responseDto: PagesResponseDto = this.pagesUtil.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('페이지 새로고침 완료', responseDto);
  }

  async deletePage(id: number): Promise<ResponseEntity<string>> {
    await this.pagesRepository.delete({ id });

    return ResponseEntity.OK('페이지 삭제 완료');
  }

  async checkDomain(domain: string): Promise<void> {
    const page: Page = await this.pagesRepository.findOneBy({ domain });

    if (page) {
      throw new ConflictException('이미 존재하는 도메인 입니다.');
    }
  }
}
