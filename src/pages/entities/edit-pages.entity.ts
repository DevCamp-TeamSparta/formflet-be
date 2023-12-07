import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './pages.entity';

@Entity()
export class EditPage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.editPage)
  page: Page;

  @Column({ type: 'longtext' })
  content: string;
}
