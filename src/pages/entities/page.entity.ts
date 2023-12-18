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
import { PageDetail } from './page-detail.entity';
import { PageFont } from './page-font.entity';
import { Form } from '../../forms/entities/forms.entity';
import { Cta } from '../../ctas/entities/cta.entity';

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

  @OneToOne(() => PageDetail, (pageDetail) => pageDetail.page, {
    cascade: true,
    eager: true,
  })
  pageDetail: PageDetail;

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

  @OneToOne(() => Cta, (cta) => cta.page, {
    cascade: true,
    eager: true,
  })
  cta: Cta;

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
    pageDetail: PageDetail,
    pageFont: PageFont,
  ) {
    this.user = user;
    this.title = title;
    this.domain = domain;
    this.url = url;
    this.pageBackup = pageBackup;
    this.pageDetail = pageDetail;
    this.pageFont = pageFont;
  }
}
