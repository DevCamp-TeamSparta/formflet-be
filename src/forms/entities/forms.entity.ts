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

  @Column({ type: 'longtext' })
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
}
