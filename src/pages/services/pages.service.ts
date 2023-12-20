import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PagesRequestDto } from '../controllers/dto/requests/pages-request.dto';
import { PagesResponseDto } from '../controllers/dto/responses/pages-response.dto';
import { PagesRepository } from '../repositories/pages.repository';
import { User } from '../../users/entities/user.entity';
import { ResponseEntity } from '../../configs/response-entity';
import { Page } from '../entities/page.entity';
import { Builder } from 'builder-pattern';
import { PagesEditRequestDto } from '../controllers/dto/requests/pages-edit-request.dto';
import { PagesDetailService } from './pages-detail.service';
import { PagesFontService } from './pages-font.service';
import { FormsService } from '../../forms/services/forms.service';
import { FormsDetailService } from '../../forms/services/forms-detail.service';
import { FormsReplyService } from '../../forms/services/forms-reply.service';
import { Form } from '../../forms/entities/forms.entity';
import { CtasService } from '../../ctas/services/ctas.service';
import { FormsUtils } from '../../forms/utils/forms.utils';
import { FormsResponseDto } from '../../forms/controllers/dtos/responses/forms-response.dto';
import { PagesUtils } from '../utils/pages.utils';

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

    // notion content encode & notion content 생성
    const content: string = encodeURIComponent(requestDto.content);

    await this.pagesDetailService.createPageDetail(page, content);

    // default pageFont, form, cta 생성
    await this.pagesFontService.createPageFont(page);

    await this.formsService.createForm(page);

    await this.ctasService.createCta(page);

    // response 생성
    const responseDto: PagesResponseDto = Builder<PagesResponseDto>().id(page.id).build();

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 등록', responseDto);
  }

  async getReleasePageByDomain(domain: string): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('getReleasePageByDomain');

    // domain 으로 page 조회
    const page: Page = await this.pagesRepository.findByDomain(domain);

    try {
      // form reply 작성여부 확인
      const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(page.form.formDetail);

      // formReply 작성여부 포함하여 response 생성
      const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormResponseDto(page.form, formReplyStatus);

      // pageResponse 생성
      const pagesResponseDto: PagesResponseDto = this.pagesUtils.buildPageResponseDto(page, formsResponseDto);

      return ResponseEntity.OK_WITH_DATA('배포 페이지 조회', pagesResponseDto);
    } catch (e) {
      throw new NotFoundException('존재하지 않는 도메인');
    }
  }

  async getAllPagesByUserId(user: User): Promise<ResponseEntity<PagesResponseDto[]>> {
    this.logger.log('getAllPagesByUserId');

    const pageList: Page[] = await this.pagesRepository.findAllByUser(user);

    try {
      const responseDtoList: PagesResponseDto[] = [];

      for (const page of pageList) {
        const pagesResponseDto: PagesResponseDto = await this.buildTotalResponseDto(page);

        responseDtoList.push(pagesResponseDto);
      }

      return ResponseEntity.OK_WITH_DATA('나의 웹페이지 전체조회', responseDtoList);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPageByPageId(id: number): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('getPageByPageId');

    const page: Page = await this.pagesRepository.findById(id);

    if (!page) throw new NotFoundException('page not found');

    // form reply 작성여부 확인
    const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(page.form.formDetail);

    // formReply 작성여부 포함하여 response 생성
    const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormResponseDto(page.form, formReplyStatus);

    // pageResponse 생성
    const pagesResponseDto: PagesResponseDto = this.pagesUtils.buildPageResponseDto(page, formsResponseDto);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 id로 조회', pagesResponseDto);
  }

  /*  async editPage(id: number, requestDto: PagesEditRequestDto): Promise<ResponseEntity<Page>> {
    this.logger.log('editPage');

    // page 조회
    const editPage: Page = await this.pagesRepository.findById(id);

    // font update
    await this.pagesFontService.updatePageFont(editPage, requestDto.font.type);

    // form 및 formDetail update
    // 답변이 있는 상태에서 새로운 form을 생성하고 싶은 경우
    if (requestDto.form.createForm) {
      await this.formsService.updateFormStatus(editPage);

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

    // console.log(resultPage);
    //
    // // form reply 작성여부 확인
    // const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(resultPage.form.formDetail[0]);
    //
    // // formReply 작성여부 포함하여 response 생성
    // const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormsResponseDto(resultPage.form, formReplyStatus);
    //
    // // pageResponse 생성
    // const pagesResponseDto: PagesResponseDto = this.pagesResponseDto.buildResponseDto(resultPage, formsResponseDto);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집', resultPage);
  }*/

  async editPage(id: number, requestDto: PagesEditRequestDto): Promise<ResponseEntity<PagesResponseDto>> {
    this.logger.log('editPage');

    // page 조회
    const editPage: Page = await this.pagesRepository.findById(id);

    // font update
    await this.pagesFontService.updatePageFont(editPage, requestDto.font.type);

    // form 및 formDetail update
    await this.formsService.updateForm(editPage, requestDto.form);

    const form: Form = await this.formsService.getFormByPage(editPage);

    await this.formsDetailService.editFormDetail(form, requestDto.form.guide);

    // cta update
    await this.ctasService.updateCta(editPage, requestDto.cta);

    // 결과 조회
    const resultPage: Page = await this.pagesRepository.findById(id);

    // form reply 작성여부 확인
    const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(resultPage.form.formDetail);

    // formReply 작성여부 포함하여 response 생성
    const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormResponseDto(resultPage.form, formReplyStatus);

    // pageResponse 생성
    const pagesResponseDto: PagesResponseDto = this.pagesUtils.buildPageResponseDto(resultPage, formsResponseDto);

    return ResponseEntity.OK_WITH_DATA('나의 웹페이지 편집', pagesResponseDto);
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
    const formReplyStatus: boolean = await this.formsReplyService.getFormReplyStatus(page.form.formDetail);

    // formReply 작성여부 포함하여 response 생성
    const formsResponseDto: FormsResponseDto = this.formsUtils.buildFormResponseDto(page.form, formReplyStatus);

    // pageResponse 생성
    return this.pagesUtils.buildPageResponseDto(page, formsResponseDto);
  }
}
