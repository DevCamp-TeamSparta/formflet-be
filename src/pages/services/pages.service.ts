import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesDetailService } from './pages-detail.service';
import { PagesFontService } from './pages-font.service';
import { FormsService } from '../../forms/services/forms.service';
import { FormsDetailService } from '../../forms/services/forms-detail.service';
import { FormsReplyService } from '../../forms/services/forms-reply.service';
import { CtasService } from '../../ctas/services/ctas.service';
import { FormsUtils } from '../../forms/utils/forms.utils';
import { FormsResponseDto } from '../../forms/controllers/dtos/responses/forms-response.dto';
import { PagesUtils } from '../utils/pages.utils';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { Form } from '../../forms/entities/forms.entity';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger('PagesService');

  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly pagesDetailService: PagesDetailService,
    private readonly pagesFontService: PagesFontService,
    private readonly pagesUtils: PagesUtils,
    private readonly formsService: FormsService,
    private readonly formsDetailService: FormsDetailService,
    private readonly formsReplyService: FormsReplyService,
    private readonly formsUtils: FormsUtils,
    private readonly ctasService: CtasService,
  ) {}

  async registerPage(user: User, requestDto: PagesRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('registerPage');

    // domain 검사
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

    // notion content 생성
    await this.pagesDetailService.createPageDetail(page, requestDto.content);

    // default pageFont, form, cta 생성
    await this.pagesFontService.createPageFont(page);

    await this.formsService.createDefaultForm(page);

    await this.ctasService.createCta(page);

    // response 생성
    const responseDto: PagesResponseDto = Builder<PagesResponseDto>().id(page.id).build();

    return ResponseEntity.OK_WITH_DATA('웹페이지 등록', responseDto);
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    this.logger.log('getAllPagesByUserId');

    const pages: Page[] = await this.pagesRepository.findAllByUserId(user);

    const responseDtos: PagesResponseDto[] = [];

    for (const page of pages) {
      const responseDto: PagesResponseDto = Builder<PagesResponseDto>()
        .id(page.id)
        .title(page.title)
        .domain(`${page.domain}.${process.env.DOMAIN}`)
        .build();

      responseDtos.push(responseDto);
    }

    return ResponseEntity.OK_WITH_DATA('웹페이지 전체조회', responseDtos);
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('getPageByPageId');

    const page: Page = await this.pagesRepository.findById(id);

    if (!page) throw new NotFoundException('Page Not Found');

    const pagesResponseDto: PagesResponseDto = await this.buildTotalResponseDto(page);

    return ResponseEntity.OK_WITH_DATA('웹페이지 id로 조회', pagesResponseDto);
  }

  async getPageByDomain(domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('getPageByDomain');

    // domain 으로 page 조회
    const page: Page = await this.pagesRepository.findByDomain(domain);

    try {
      const pagesResponseDto: PagesResponseDto = await this.buildTotalResponseDto(page);

      return ResponseEntity.OK_WITH_DATA('배포 페이지 조회', pagesResponseDto);
    } catch (e) {
      throw new NotFoundException('존재하지 않는 도메인');
    }
  }

  async editPage(id: number, requestDto: PagesEditRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('editPage');

    // page 조회
    const editPage: Page = await this.pagesRepository.findById(id);

    if (!editPage) throw new NotFoundException('존재하지 않는 페이지');

    // pageDetail update
    await this.pagesDetailService.updatePageDetail(editPage, requestDto.content);

    // font update
    await this.pagesFontService.updatePageFont(editPage, requestDto.font.type);

    // form 및 formDetail update
    // 답변이 있는 상태에서 새로운 form을 생성하고 싶은 경우
    if (requestDto.form.createForm) {
      // page <-> form 연결상태 수정
      const beforeForm: Form = await this.formsService.updatePageConnect(editPage);

      // form 활성화 상태 수정
      await this.formsService.updateStatus(beforeForm);

      // 새로운 폼 생성
      await this.formsService.createDifferentForm(editPage, requestDto.form);

      const form: Form = await this.formsService.getFormByPage(editPage);

      await this.formsDetailService.createFormDetail(form, requestDto.form.guide);
    } else {
      await this.formsService.updateForm(editPage, requestDto.form);

      const form: Form = await this.formsService.getFormByPage(editPage);

      await this.formsDetailService.editFormDetail(form, requestDto.form.guide);
    }

    // cta update
    await this.ctasService.updateCta(editPage, requestDto.cta);

    // 결과 조회
    const resultPage: Page = await this.pagesRepository.findById(id);

    const pagesResponseDto: PagesResponseDto = await this.buildTotalResponseDto(resultPage);

    return ResponseEntity.OK_WITH_DATA('웹페이지 편집', pagesResponseDto);
  }

  async deletePage(id: number): Promise<ResponseEntity<string>> {
    this.logger.log('deletePage');

    await this.pagesRepository.deleteById(id);

    return ResponseEntity.OK('페이지 삭제 완료');
  }

  async checkDomain(domain: string): Promise<void> {
    this.logger.log('checkDomain');

    const page: Page = await this.pagesRepository.findByDomain(domain);

    if (page) {
      throw new ConflictException('이미 존재하는 도메인 입니다.');
    }
  }

  async buildTotalResponseDto(page: Page): Promise<PagesResponseDto> {
    // form reply 작성여부 확인
    const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(page.forms[0].formDetail);

    // formReply 작성여부 포함하여 response 생성
    const formsResponseDtos: FormsResponseDto[] = [];

    for (const form of page.forms) {
      const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormResponseDto(form, formReplyStatus);

      formsResponseDtos.push(formsResponseDto);
    }

    // pageResponse 생성
    return this.pagesUtils.buildPageResponseDto(page, formsResponseDtos);
  }
}
