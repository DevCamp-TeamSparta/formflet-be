import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './page.entity';

@Entity()
export class FontStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.fontStyle)
  page: Page;

  @Column()
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}
