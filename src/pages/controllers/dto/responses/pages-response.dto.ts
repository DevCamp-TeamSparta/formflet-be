import { EditPage } from '../../../entities/edit-pages.entity';

export class PagesResponseDtoBuilder {
  private id?: number;
  private userId?: number;
  private title?: string;
  private customDomain?: string;
  private pageUrl?: string;
  private editPage?: EditPage[];

  setId(id: number): this {
    this.id = id;
    return this;
  }

  setUserId(userId: number): this {
    this.userId = userId;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setCustomDomain(customDomain: string): this {
    this.customDomain = customDomain;
    return this;
  }

  setPageUrl(pageUrl: string): this {
    this.pageUrl = pageUrl;
    return this;
  }

  setEditPage(editPage: EditPage[]): this {
    this.editPage = editPage;
    return this;
  }

  build(): PagesResponseDto {
    return new PagesResponseDto({
      id: this.id,
      userId: this.userId,
      title: this.title,
      customDomain: this.customDomain,
      pageUrl: this.pageUrl,
      editPage: this.editPage,
    });
  }
}

export class PagesResponseDto {
  readonly id?: number;
  readonly userId?: number;
  readonly title?: string;
  readonly customDomain?: string;
  readonly pageUrl?: string;
  readonly editPage?: EditPage[];

  constructor(data: {
    id?: number;
    userId?: number;
    title?: string;
    customDomain?: string;
    pageUrl?: string;
    editPage?: EditPage[];
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.customDomain = data.customDomain;
    this.pageUrl = data.pageUrl;
    this.editPage = data.editPage;
  }

  static builder(): PagesResponseDtoBuilder {
    return new PagesResponseDtoBuilder();
  }
}
