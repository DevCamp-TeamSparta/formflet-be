import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { PageBackup } from '../entities/page-backup.entity';
import { PageContent } from '../entities/page-content.entity';
import { Builder } from 'builder-pattern';
import { FontStyle } from '../entities/font-style.entity';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesSupportService } from './pages-support.service';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesSupportService: PagesSupportService,
    private readonly pagesRepository: PagesRepository,
  ) {}

  async registerPage(
    user: User,
    requestDto: PagesRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${requestDto.title}`);
    this.logger.log(`customDomain: ${requestDto.customDomain}`);
    this.logger.log(`pageUrl: ${requestDto.pageUrl}`);

    const content: string = await this.pagesSupportService.scrapNotionPage(
      requestDto.pageUrl,
    );

    const pageBackup: PageBackup = Builder<PageBackup>().content(content).build();
    const pageContent: PageContent = Builder<PageContent>().content(content).build();
    const fontStyle: FontStyle = Builder<FontStyle>().type('default').build();

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

    const pagesResponseDto: PagesResponseDto =
      this.pagesSupportService.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('노션 페이지 저장 완료', pagesResponseDto);
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    try {
      const pageList: Page[] = await this.pagesRepository.findAllByUserId(user);
      const pagesResponseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const pagesResponseDto: PagesResponseDto =
          this.pagesSupportService.buildPagesResponseDto(page);

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
        this.pagesSupportService.buildPagesResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('특정 노션 페이지 조회 성공', pagesResponseDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async editPage(
    id: number,
    pagesEditRequestDto: PagesEditRequestDto,
  ): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });

    page.fontStyle.type = pagesEditRequestDto.type;

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto =
      this.pagesSupportService.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집 완료', pagesResponseDto);
  }

  async refreshPage(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    const page: Page = await this.pagesRepository.findOneBy({ id });

    const content: string = await this.pagesSupportService.scrapNotionPage(page.pageUrl);

    page.pageBackup.content = content;
    page.pageContent.content = content;
    page.fontStyle.type = 'default';

    await this.pagesRepository.save(page);

    const pagesResponseDto: PagesResponseDto =
      this.pagesSupportService.buildPagesResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('페이지 새로고침 완료', pagesResponseDto);
  }

  async deletePage(id: number): Promise<ResponseEntity<string>> {
    await this.pagesRepository.delete({ id });

    return ResponseEntity.OK('페이지 삭제 완료');
  }
}
