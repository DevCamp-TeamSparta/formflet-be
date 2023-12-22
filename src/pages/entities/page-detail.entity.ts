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
export class PageDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.pageDetail, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column({ type: 'longtext' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /*  update(content: string): void {
    this.content = content;
  }*/
}
