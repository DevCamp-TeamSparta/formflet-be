import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PageBackup } from './page-backup.entity';
import { PageContent } from './page-content.entity';
import { FontStyle } from './font-style.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  customDomain: string;

  @Column()
  pageUrl: string;

  @OneToOne(() => PageBackup, (originalPage) => originalPage.page, { cascade: true })
  @JoinColumn()
  pageBackup: PageBackup;

  @OneToOne(() => PageContent, (pageContent) => pageContent.page, { cascade: true, eager: true })
  @JoinColumn()
  pageContent: PageContent;

  @OneToOne(() => FontStyle, (fontStyle) => fontStyle.page, { cascade: true, eager: true })
  @JoinColumn()
  fontStyle: FontStyle;

  constructor(
    userId: number,
    title: string,
    customDomain: string,
    pageUrl: string,
    pageBackup: PageBackup,
    pageContent: PageContent,
    fontStyle: FontStyle,
  ) {
    this.userId = userId;
    this.title = title;
    this.customDomain = customDomain;
    this.pageUrl = pageUrl;
    this.pageBackup = pageBackup;
    this.pageContent = pageContent;
    this.fontStyle = fontStyle;
  }
}
