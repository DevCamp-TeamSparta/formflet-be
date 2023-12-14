import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from './forms.entity';
import { FormDetail } from './forms-detail.entity';

@Entity()
export class FormResponse {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => FormDetail, (formDetail) => formDetail.formResponse, { onDelete: 'CASCADE' })
  @JoinColumn()
  form: Form;

  @Column()
  answer: string;
}
