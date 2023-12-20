import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from '../../pages/entities/page.entity';
import { FormDetail } from './forms-detail.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (page) => page.forms, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column()
  pageConnect: boolean;

  @Column()
  status: boolean;

  @Column()
  title: string;

  @Column()
  guide: string;

  @OneToMany(() => FormDetail, (formDetail) => formDetail.form, {
    cascade: true,
    eager: true,
  })
  formDetail: FormDetail[];

  constructor(page: Page, title: string, status: boolean, guide: string) {
    this.page = page;
    this.title = title;
    this.status = status;
    this.guide = guide;
  }
}
