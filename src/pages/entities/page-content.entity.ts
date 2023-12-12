import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './page.entity';

@Entity()
export class PageContent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.pageContent)
  page: Page;

  @Column({ type: 'longtext' })
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}
