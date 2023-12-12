import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { PageBackup } from '../entities/page-backup.entity';
import { PagesContentRepository } from '../repositories/pages-content.repository';
import { PageContent } from '../entities/page-content.entity';
import { PagesBackupRepository } from '../repositories/pages-backup.repository';
import { Builder } from 'builder-pattern';
import { FontStyle } from '../entities/font-style.entity';
import { FontStyleRepository } from '../repositories/font-style.repository';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesSupportService } from './pages-support.service';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesSupportService: PagesSupportService,
    private readonly pagesRepository: PagesRepository,
    private readonly pagesBackupRepository: PagesBackupRepository,
    private readonly pagesContentRepository: PagesContentRepository,
    private readonly pagesFontRepository: FontStyleRepository,
  ) {}

  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${requestDto.title}`);
    this.logger.log(`customDomain: ${requestDto.customDomain}`);
    this.logger.log(`pageUrl: ${requestDto.pageUrl}`);

    const content: string = await this.pagesSupportService.scrapNotionPage(requestDto.pageUrl);

    const [pageBackup, pageContent, fontStyle] = await Promise.all([
      this.createPageBackup(content),
      this.createPageContent(content),
      this.createPageFont(),
    ]);

    const page: Page = Builder<Page>()
      .userId(user.id)
      .title(requestDto.title)
      .customDomain(requestDto.customDomain)
      .pageUrl(requestDto.pageUrl)
      .pageBackup(pageBackup)
      .pageContent(pageContent)
      .fontStyle(fontStyle)
      .build();

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto = this.pagesSupportService.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('노션 페이지 저장 완료', pagesResponseDto);
  }

  async createPageBackup(content: string): Promise<PageBackup> {
    this.logger.log('start createPageOriginal');

    const pageBackup: PageBackup = Builder<PageBackup>().content(content).build();
    return await this.pagesBackupRepository.save(pageBackup);
  }

  async updatePageBackup(pageBackup: PageBackup, content: string): Promise<PageBackup> {
    this.logger.log('start createPageOriginal');

    pageBackup.content = content;
    return await this.pagesBackupRepository.save(pageBackup);
  }

  async createPageContent(content: string): Promise<PageContent> {
    this.logger.log('start createPageContent');

    const pageContent: PageContent = Builder<PageContent>().content(content).build();
    return await this.pagesContentRepository.save(pageContent);
  }

  async updatePageContent(pageContent: PageContent, content: string): Promise<PageBackup> {
    this.logger.log('start createPageOriginal');

    pageContent.content = content;
    return await this.pagesContentRepository.save(pageContent);
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    try {
      const pageList: Page[] = await this.pagesRepository.findAllByUserId(user);
      const pagesResponseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const pagesResponseDto: PagesResponseDto = this.pagesSupportService.buildPagesResponseDto(page);

        pagesResponseDtoList.push(pagesResponseDto);
      }

      return ResponseEntity.OK_WITH_DATA('전체 노션 페이지 조회 성공', pagesResponseDtoList);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    try {
      const page: Page = await this.pagesRepository.findOneBy({ id });
      const pagesResponseDto: PagesResponseDto = this.pagesSupportService.buildPagesResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('특정 노션 페이지 조회 성공', pagesResponseDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async editPage(id: number, pagesEditRequestDto: PagesEditRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });
    const fontStyle: FontStyle = await this.pagesFontRepository.findOneBy({ page });

    await this.updatePageFont(fontStyle, pagesEditRequestDto.type);
    await this.updatePageFontInPage(page, fontStyle);

    const pagesResponseDto: PagesResponseDto = this.pagesSupportService.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집 완료', pagesResponseDto);
  }

  async updatePageFontInPage(page: Page, fontStyle: FontStyle) {
    page.fontStyle = fontStyle;
    await this.pagesRepository.save(page);
  }

  async createPageFont(): Promise<FontStyle> {
    const type: string = 'default';

    const fontStyle: FontStyle = Builder<FontStyle>().type(type).build();
    return await this.pagesFontRepository.save(fontStyle);
  }

  async updatePageFont(fontStyle: FontStyle, type: string): Promise<FontStyle> {
    fontStyle.type = type;
    return await this.pagesFontRepository.save(fontStyle);
  }
}
