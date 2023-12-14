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
export class PageFont {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Page, (page) => page.pageFont, {
    onDelete: 'CASCADE',
  })
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
