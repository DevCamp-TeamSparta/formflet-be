import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PagesRequestDto } from '../dto/requests/pages-request.dto';
import { PagesResponseDto } from '../dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PagesService {
  constructor(private readonly repository: PagesRepository) {}
  async registerPage(user: User, pagesRequestDto: PagesRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    const userId: number = user.id;
    const notionUrl: string = pagesRequestDto.notionUrl;

    const page: Page = this.repository.create({ userId, notionUrl });

    try {
      await this.repository.save(page);

      const data: PagesResponseDto = plainToInstance(PagesResponseDto, page);

      return ResponseEntity.OK_WITH_DATA('페이지가 생성되었습니다.', data);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
