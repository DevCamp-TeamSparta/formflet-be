import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/pages.entity';
import { OriginalPagesRepository } from '../repositories/original-pages.repository';
import { OriginalPage } from '../entities/original-pages.entity';
import { EditPagesRepository } from '../repositories/edit-pages.repository';
import { EditPage } from '../entities/edit-pages.entity';
import puppeteer from 'puppeteer';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly originalPagesRepository: OriginalPagesRepository,
    private readonly editPagesRepository: EditPagesRepository,
  ) {}

  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${requestDto.title}`);
    this.logger.log(`customDomain: ${requestDto.customDomain}`);
    this.logger.log(`pageUrl: ${requestDto.pageUrl}`);

    // notion page scraping
    const content: string = await this.scrapNotionPage(requestDto.pageUrl);

    const userId: number = user.id;
    const { title, customDomain, pageUrl } = requestDto;

    const [originalPage, editPage] = await Promise.all([
      this.registerOriginalPage(content),
      this.registerEditPage(content),
    ]);

    const page: Page = this.pagesRepository.create({ userId, title, customDomain, pageUrl, originalPage, editPage });

    await this.pagesRepository.save(page);

    this.logger.log('finished registerPage');
    return ResponseEntity.OK('노션 페이지 저장 완료');
  }

  async scrapNotionPage(pageUrl: string) {
    this.logger.log('start scrapNotionPage');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const url: string = pageUrl;
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    await this.openToggles(page);

    const notionAppHTML: string = await page.evaluate(() => {
      const element = document.getElementById('notion-app');
      return element ? element.innerHTML : '';
    });

    await browser.close();
    // const domainName: string = new URL(url).hostname;

    // return { props: { notionAppHTML, domainName } };
    return notionAppHTML;
  }

  async openToggles(page) {
    let isClosedToggleExist = true;

    while (isClosedToggleExist) {
      // div[aria-label="열기"] 요소들을 찾아 클릭
      isClosedToggleExist = await page.evaluate(() => {
        const toggles = Array.from(document.querySelectorAll('div[aria-label="열기"]'));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        toggles.forEach((toggle) => toggle.click());
        return toggles.length > 0;
      });

      if (isClosedToggleExist) {
        await page.waitForTimeout(1000);
      }
    }
  }

  async registerOriginalPage(content: string): Promise<OriginalPage> {
    this.logger.log('start registerOriginalPage');

    const originalPage: OriginalPage = this.originalPagesRepository.create({ content });
    return await this.originalPagesRepository.save(originalPage);
  }

  async registerEditPage(content: string): Promise<EditPage> {
    this.logger.log('start registerEditPage');

    const editPage: EditPage = this.editPagesRepository.create({ content });
    return await this.editPagesRepository.save(editPage);
  }

  async getAllPageByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    try {
      const pageList: Page[] = await this.pagesRepository.findAllByUserId(user);

      const data: PagesResponseDto[] = plainToInstance(PagesResponseDto, pageList);

      return ResponseEntity.OK_WITH_DATA('전체 노션 페이지 조회 성공', data);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
