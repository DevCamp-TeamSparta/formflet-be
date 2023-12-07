import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './pages.entity';

@Entity()
export class OriginalPage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.originalPage)
  page: Page;

  @Column({ type: 'longtext' })
  content: string;
}
