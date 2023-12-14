import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from './forms.entity';
import { FormResponse } from './forms-response.entity';

@Entity()
export class FormDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Form, (form) => form.formDetail, { onDelete: 'CASCADE' })
  @JoinColumn()
  form: Form;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({ nullable: false })
  content: string;

  @OneToMany(() => FormResponse, (formResponse) => formResponse.form, {
    cascade: true,
    eager: true,
  })
  formResponse: FormResponse[];
}
