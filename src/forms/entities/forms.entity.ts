import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from '../../pages/entities/page.entity';
import { FormDetail } from './forms-detail.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.form, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column()
  status: boolean;

  @Column()
  guide: string;

  @OneToMany(() => FormDetail, (formDetail) => formDetail.form, {
    cascade: true,
    eager: true,
  })
  formDetail: FormDetail[];

  constructor(page: Page, status: boolean, guide: string) {
    this.page = page;
    this.status = status;
    this.guide = guide;
  }
}
