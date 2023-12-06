import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PageDetail } from './pages-detail.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  pageUrl: string;

  @OneToMany(() => PageDetail, (pageDetail) => pageDetail.page, { cascade: true, eager: true })
  pageDetails: PageDetail[];
}
