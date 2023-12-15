import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
