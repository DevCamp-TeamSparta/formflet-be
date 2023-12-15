import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from './forms.entity';
import { FormReply } from './forms-reply.entity';

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

  @OneToMany(() => FormReply, (fromReply) => fromReply.formDetail, {
    cascade: true,
    eager: true,
  })
  formReplies: FormReply[];
}
