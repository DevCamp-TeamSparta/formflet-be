import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from '../../pages/entities/page.entity';
import { FormDetail } from './forms-detail.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (page) => page.forms, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column({ name: 'IS_CONNECTION' })
  isConnection: boolean;

  @Column()
  status: boolean;

  @Column()
  title: string;

  @Column()
  guide: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FormDetail, (formDetail) => formDetail.form, {
    cascade: true,
    eager: true,
  })
  formDetail: FormDetail[];

  constructor(page: Page, isConnection: boolean, status: boolean, title: string, guide: string) {
    this.page = page;
    this.isConnection = isConnection;
    this.status = status;
    this.title = title;
    this.guide = guide;
  }
}
