import { Injectable, Logger } from '@nestjs/common';
import { CtasRepository } from '../repositories/ctas.repository';
import { Cta } from '../entities/cta.entity';
import { Page } from '../../pages/entities/page.entity';
import { Builder } from 'builder-pattern';
import { CtasRequestDto } from '../controllers/dtos/requests/ctas-request.dto';

@Injectable()
export class CtasService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: CtasRepository) {}

  async createCta(page: Page): Promise<Cta> {
    const cta: Cta = Builder<Cta>()
      .page(page)
      .status(false)
      .content('')
      .link('')
      .fontSize('24px')
      .fontColor('#FFFFFF')
      .backgroundColor('#484848')
      .build();

    return await this.repository.save(cta);
  }

  async getCtaByPageId(page: Page): Promise<Cta> {
    return await this.repository.findByPageId(page);
  }

  async updateCta(page: Page, requestDto: CtasRequestDto): Promise<void> {
    const cta: Cta = await this.getCtaByPageId(page);

    cta.update(requestDto);

    await this.repository.save(cta);
  }

  async deleteCtaByPageId(page: Page): Promise<void> {
    await this.repository.deleteByPageId(page);
  }
}
