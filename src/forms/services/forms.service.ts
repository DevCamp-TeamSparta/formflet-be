import { Injectable, Logger } from '@nestjs/common';
import { FormsRepository } from '../repositories/forms.repository';
import { Page } from '../../pages/entities/page.entity';
import { Form } from '../entities/forms.entity';
import { Builder } from 'builder-pattern';
import { FormsRequestDto } from '../controllers/dtos/reqeusts/forms-request.dto';

@Injectable()
export class FormsService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(private readonly repository: FormsRepository) {}

  async createForm(page: Page): Promise<Form> {
    const form: Form = Builder<Form>()
      .page(page)
      .status(true)
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

  async getFormByPage(page: Page): Promise<Form> {
    return await this.repository.findByPage(page);
  }

  async getFormById(id: number): Promise<Form> {
    this.logger.log('getFormById');

    return await this.repository.findById(id);
  }

  async getAllFormByPage(page: Page): Promise<Form[]> {
    return await this.repository.findAllByPage(page);
  }

  async updateForm(page: Page, requestDto: FormsRequestDto) {
    this.logger.log('updateForm');

    const form: Form = await this.getFormByPage(page);

    const formArray: Form[] = await this.getAllFormByPage(page);

    form.title = `${this.getTitleByGuide(page.form.guide)} ${formArray.length + 1}`;
    form.status = requestDto.status;
    form.guide = requestDto.guide;

    await this.repository.save(form);
  }

  async deleteAllFormByPageId(page: Page) {
    await this.repository.delete({ page: { id: page.id } });
  }

  getTitleByGuide(guide: string): string {
    // 정규식
    const titleRegex = /\[제목\] (.*?)\n/g;

    return titleRegex.exec(guide)[1];
  }
}
