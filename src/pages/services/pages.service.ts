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
import puppeteer from 'puppeteer';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly pagesDetailRepository: PagesDetailRepository,
  ) {}
  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<string>> {
    const content: string = await this.scrapNotionPage(requestDto.pageUrl);

    const userId: number = user.id;
    const pageUrl: string = requestDto.pageUrl;

    this.logger.log(`userId: ${userId}`);
    this.logger.log(`pageUrl: ${pageUrl}`);

    const page: Page = this.pagesRepository.create({ userId, pageUrl });

    try {
      await this.pagesRepository.save(page);

      return this.registerPageDetail(page, content);
    } catch (e) {
      throw new InternalServerErrorException('페이지 URL 저장 오류');
    }
  }

  async registerPageDetail(page: Page, content: string): Promise<ResponseEntity<string>> {
    const pageDetail: PageDetail = this.pagesDetailRepository.create({ page, content });

    try {
      await this.pagesDetailRepository.save(pageDetail);

      return ResponseEntity.OK('노션 페이지 저장 완료');
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

  async scrapNotionPage(pageUrl: string) {
    this.logger.log('start scrapping');

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
}
