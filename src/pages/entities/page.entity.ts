import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PageBackup } from './page-backup.entity';
import { PageContent } from './page-content.entity';
import { PageFont } from './page-font.entity';
import { Form } from '../../forms/entities/forms.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.page, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

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

  @OneToOne(() => Form, (form) => form.page, {
    cascade: true,
    eager: true,
  })
  form: Form;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    user: User,
    title: string,
    domain: string,
    url: string,
    pageBackup: PageBackup,
    pageContent: PageContent,
    pageFont: PageFont,
  ) {
    this.user = user;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageBackup = pageBackup;
    this.pageContent = pageContent;
    this.pageFont = pageFont;
  }
}
