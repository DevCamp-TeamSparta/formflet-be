import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './pages.entity';

@Entity()
export class PageDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (page) => page.pageDetails)
  page: Page;

  @Column({ type: 'longtext' })
  content: string;
}
