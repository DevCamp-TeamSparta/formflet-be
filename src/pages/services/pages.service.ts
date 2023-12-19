import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesBackupService } from './pages-backup.service';
import { PagesContentService } from './pages-content.service';
import { PagesFontService } from './pages-font.service';
import { FormsService } from '../../forms/services/forms.service';
import { FormsDetailService } from '../../forms/services/forms-detail.service';
import { FormsReplyService } from '../../forms/services/forms-reply.service';
import { Form } from '../../forms/entities/forms.entity';
import { CtasService } from '../../ctas/services/ctas.service';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly pagesBackupService: PagesBackupService,
    private readonly pagesContentService: PagesContentService,
    private readonly pagesFontService: PagesFontService,
    private readonly pagesResponseDto: PagesResponseDto,
    private readonly formsService: FormsService,
    private readonly formsDetailService: FormsDetailService,
    private readonly formsResponseService: FormsReplyService,
    private readonly ctasService: CtasService,
  ) {}

  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<string>> {
    this.logger.log('start registerPage');
    this.logger.log(`title: ${requestDto.title}`);
    this.logger.log(`domain: ${requestDto.domain}`);
    this.logger.log(`url: ${requestDto.url}`);

    // domain 중복 검사
    await this.checkDomain(requestDto.domain);

    // page 생성
    const page: Page = Builder<Page>()
      .user(user)
      .title(requestDto.title)
      .domain(requestDto.domain)
      .url(requestDto.url)
      .build();

    // page 저장
    await this.pagesRepository.save(page);

    // Notion content encode
    const content = encodeURIComponent(requestDto.content);
    // Notion data 생성
    await this.pagesContentService.createPageDetail(page, content);
    // Notion 수정사항 반영 여부를 위한 Notion data backup 생성
    await this.pagesBackupService.createPageBackup(page, content);
    // default pageFont 생성
    await this.pagesFontService.createPageFont(page);
    // default form 생성
    await this.formsService.createForm(page);
    // default cta 생성
    await this.ctasService.createCta(page);

    return ResponseEntity.OK('나의 웹페이지 등록');
  }

  async getReleasePageByDomain(domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    // domain 으로 page 조회
    const page: Page = await this.pagesRepository.findOneBy({ domain });

    try {
      const responseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(page);
      return ResponseEntity.OK_WITH_DATA('배포 페이지 조회', responseDto);
    } catch (e) {
      throw new NotFoundException('존재하지 않는 도메인');
    }
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    const pageList: Page[] = await this.pagesRepository.findBy({ user: { id: user.id } });

    try {
      const responseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const responseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(page);
        responseDtoList.push(responseDto);
      }

      return ResponseEntity.OK_WITH_DATA('나의 웹페이지 전체조회', responseDtoList);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    try {
      const page: Page = await this.pagesRepository.findOneBy({ id });
      const responseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('나의 웹페이지 id로 조회', responseDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async editPage(id: number, requestDto: PagesEditRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('start editPage');

    // page 조회
    const editPage: Page = await this.pagesRepository.findOneBy({ id });

    // font update
    await this.pagesFontService.updatePageFont(editPage, requestDto.font.type);

    // form 및 formDetail update
    await this.formsService.updateForm(editPage, requestDto.form);

    const form: Form = await this.formsService.getFormByPage(editPage);
    await this.formsDetailService.createFormDetail(form, requestDto.form.guide);

    // cta update
    await this.ctasService.updateCta(editPage, requestDto.cta);

    // 결과 조회
    const resultPage: Page = await this.pagesRepository.findOneBy({ id });

    // 응답 생성 및 return
    const responseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(resultPage);
    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집', responseDto);
  }

  async refreshPage(id: number, content: string): Promise<ResponseEntity<PagesResponseDto>> {
    // 대상 page 조회
    const targetPage: Page = await this.pagesRepository.findOneBy({ id });
    // scrapping data backup 및 content 업데이트
    await this.pagesBackupService.updatePageBackup(targetPage, content);
    await this.pagesContentService.updatePageDetail(targetPage, content);

    // 폰트 초기화
    await this.pagesFontService.updatePageFont(targetPage, '');

    // form 및 cta 삭제
    await this.formsService.deleteAllFormByPageId(targetPage);
    await this.ctasService.deleteCtaByPageId(targetPage);

    // 적용된 page 조회 후 응답생성
    const reflectionPage: Page = await this.pagesRepository.findOneBy({ id });
    const responseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(reflectionPage);

    // return
    return ResponseEntity.OK_WITH_DATA('페이지 새로고침', responseDto);
  }

  async deletePage(id: number): Promise<ResponseEntity<string>> {
    await this.pagesRepository.delete({ id });

    return ResponseEntity.OK('페이지 삭제 완료');
  }

  async checkDomain(domain: string): Promise<void> {
    const page: Page = await this.pagesRepository.findOneBy({ domain });

    if (page) {
      throw new ConflictException('이미 존재하는 도메인 입니다.');
    }
  }
}
