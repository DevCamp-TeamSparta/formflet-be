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
export class PageBackup {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.pageBackup, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column({ type: 'longtext' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(content: string) {
    this.content = content;
  }

  update(content: string): void {
    this.content = content;
  }
}
