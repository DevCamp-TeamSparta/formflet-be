import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PageBackup } from './page-backup.entity';
import { PageContent } from './page-content.entity';
import { PageFont } from './page-font.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  domain: string;

  @Column()
  url: string;

  @OneToOne(() => PageBackup, (pageBackup) => pageBackup.page, {
    cascade: true,
    eager: true,
  })
  pageBackup: PageBackup;

  @OneToOne(() => PageContent, (pageContent) => pageContent.page, {
    cascade: true,
    eager: true,
  })
  pageContent: PageContent;

  @OneToOne(() => PageFont, (pageFont) => pageFont.page, {
    cascade: true,
    eager: true,
  })
  pageFont: PageFont;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    userId: number,
    title: string,
    domain: string,
    url: string,
    pageBackup: PageBackup,
    pageContent: PageContent,
    pageFont: PageFont,
  ) {
    this.userId = userId;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageBackup = pageBackup;
    this.pageContent = pageContent;
    this.pageFont = pageFont;
  }
}
