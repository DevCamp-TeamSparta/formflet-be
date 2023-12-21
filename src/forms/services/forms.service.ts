import { Injectable, Logger } from '@nestjs/common';
import { FormsRepository } from '../repositories/forms.repository';
import { Page } from '../../pages/entities/page.entity';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';
import { FormsRequestDto } from '../controllers/dtos/reqeusts/forms-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { FormsResponseDto } from '../controllers/dtos/responses/forms-response.dto';

@Injectable()
export class FormsService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: FormsRepository) {}

  async createDefaultForm(page: Page): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .isConnection(true)
      .status(false)
      .title('제목을 입력해주세요.')
      .guide(
        '[제목] 제목을 입력해주세요.\n' +
          '[텍스트] 폼 작성을 위한 샘플 양식입니다. 폼 편집 탭에서 자유롭게 수정해주세요.\n' +
          '[질문_*] 질문을 입력해주세요.\n' +
          '[주관식] ex) 답변을 입력하세요.\n' +
          '[질문_*] 두번째 질문을 입력해주세요.\n' +
          '[객관식] 아시아_유럽\n' +
          '[질문] 세번째 질문을 입력해주세요.\n' +
          '[객관식_복수] 태평양_대서양',
      )
      .build();

    return await this.repository.save(form);
  }

  async createDifferentForm(page: Page, requestDto: FormsRequestDto): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .isConnection(true)
      .status(requestDto.status)
      .title(this.getTitleFromGuide(requestDto.guide))
      .guide(requestDto.guide)
      .build();

    return await this.repository.save(form);
  }

  async getAllFormsByPageId(pageId: number): Promise<ResponseEntity<FormsResponseDto[]>> {
    const forms: Form[] = await this.repository.findAllByPageId(pageId);

    const formsResponseDtos: FormsResponseDto[] = [];

    for (const form of forms) {
      const formsResponseDto: FormsResponseDto = Builder<FormsResponseDto>()
        .id(form.id)
        .isConnection(form.isConnection)
        .status(form.status)
        .title(form.title)
        .guide(form.guide)
        .formDetails(form.formDetail)
        .build();

      formsResponseDtos.push(formsResponseDto);
    }

    return ResponseEntity.OK_WITH_DATA('폼 전체조회', formsResponseDtos);
  }

  async getFormByPage(page: Page): Promise<Form> {
    return await this.repository.findByPage(page);
  }

  async getFormById(id: number): Promise<Form> {
    this.logger.log('getFormById');

    return await this.repository.findById(id);
  }

  async updateForm(page: Page, requestDto: FormsRequestDto): Promise<void> {
    this.logger.log('updateForm');

    const form: Form = await this.getFormByPage(page);

    form.status = requestDto.status;
    form.guide = requestDto.guide;

    await this.repository.save(form);
  }

  async updatePageConnect(page: Page): Promise<Form> {
    this.logger.log('updatePageConnect');

    const form: Form = await this.getFormByPage(page);

    form.isConnection = false;

    return await this.repository.save(form);
  }

  async updateStatus(form: Form): Promise<void> {
    this.logger.log('updateStatus');

    form.status = false;

    await this.repository.save(form);
  }

  async deleteAllFormByPageId(page: Page): Promise<void> {
    await this.repository.delete({ page: { id: page.id } });
  }

  getTitleFromGuide(guide: string): string {
    const titleRegex = /\[제목\] (.*?)\n/g;

    return titleRegex.exec(guide)[1];
  }
}
