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
    await page.goto(notionUrl, {
      waitUntil: 'networkidle0',
    });

    await this.openToggles(page);

    const notionAppHTML: string = await page.evaluate((notionUrl) => {
      const domainName = new URL(notionUrl).hostname;
      const element = document.getElementById('notion-app');

      const frame = element.querySelector('.notion-frame');
      if (frame && frame instanceof HTMLElement) {
        frame.style.width = '100%';
      }
      const cursor = element.querySelector('.notion-cursor-listener');
      if (cursor && cursor instanceof HTMLElement) {
        cursor.style.width = '100%';
      }

      const images = element.querySelectorAll('img');
      images.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('https://')) {
          const imgSrc = `https://${domainName}${src}`;
          img.setAttribute('src', imgSrc);
        }
      });

      const anchors = element.querySelectorAll('a');
      anchors.forEach((anchor) => {
        const src = anchor.getAttribute('href');
        if (src && !src.startsWith('https://')) {
          const anchorSrc = `https://${domainName}${src}`;
          anchor.setAttribute('href', anchorSrc);
        }
      });

      const topbar = element.querySelector('header');
      if (!topbar) return;
      while (topbar.hasChildNodes()) {
        const child = topbar.firstChild;
        if (child) {
          topbar.removeChild(child);
        }
      }

      const toggles = element.querySelectorAll('div[aria-label="닫기"]');
      toggles.forEach((toggle) => {
        const svg = toggle.querySelector('svg');
        const sibling = toggle.parentElement?.nextElementSibling;
        if (sibling) {
          Array.from(sibling.children).forEach((element, index) => {
            if (index === 0) return;
            const child = element as HTMLElement;
            if (child instanceof HTMLElement) {
              child.style.display = 'none';
              if (svg) {
                svg.style.transform = 'rotate(90deg)';
              }
            }
          });
        }
      });

      return element ? element.innerHTML : '';
    }, notionUrl);

    await browser.close();
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

  buildPagesResponseDto(page: Page): PagesResponseDto {
    return Builder<PagesResponseDto>()
      .id(page.id)
      .title(page.title)
      .domain(`${page.domain}.${process.env.DOMAIN}`)
      .url(page.url)
      .pageContent(page.pageContent)
      .pageFont(page.pageFont)
      .form(page.form)
      .cta(page.cta)
      .build();
  }
}
