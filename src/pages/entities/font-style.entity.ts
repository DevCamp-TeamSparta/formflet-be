import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from './page.entity';

@Entity()
export class FontStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.fontStyle, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(type: string) {
    this.type = type;
  }
}
