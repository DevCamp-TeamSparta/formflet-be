import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FormDetail } from './forms-detail.entity';

@Entity()
export class FormReply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FormDetail, (formDetail) => formDetail.formReplies, { onDelete: 'CASCADE' })
  @JoinColumn()
  formDetail: FormDetail;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
