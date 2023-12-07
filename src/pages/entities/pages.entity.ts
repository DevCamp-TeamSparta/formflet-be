import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OriginalPage } from './original-pages.entity';
import { EditPage } from './edit-pages.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  customDomain: string;

  @Column()
  pageUrl: string;

  @OneToOne(() => OriginalPage, (originalPage) => originalPage.page, { cascade: true, eager: true })
  @JoinColumn()
  originalPage: OriginalPage;

  @OneToOne(() => EditPage, (editPage) => editPage.page, { cascade: true, eager: true })
  @JoinColumn()
  editPage: EditPage;
}
