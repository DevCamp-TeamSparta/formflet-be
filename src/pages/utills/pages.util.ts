import { Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';

export class PagesUtil {
  private readonly logger: Logger = new Logger('PagesUtil');

  async scrapNotionPage(notionUrl: string) {
    this.logger.log('start scrapNotionPage');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const url: string = notionUrl;
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
        // const toggles = Array.from(document.querySelectorAll('.pseudoSelection [role="button"]'));
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

  buildPagesResponseDto(page: Page) {
    return Builder<PagesResponseDto>()
      .id(page.id)
      .userId(page.userId)
      .title(page.title)
      .domain(`${page.domain}.${process.env.DOMAIN}`)
      .url(page.url)
      .pageContent(page.pageContent)
      .pageFont(page.pageFont)
      .build();
  }
}
