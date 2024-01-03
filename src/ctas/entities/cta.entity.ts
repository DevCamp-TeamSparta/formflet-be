import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from '../../pages/entities/page.entity';
import { CtasRequestDto } from '../controllers/dtos/requests/ctas-request.dto';

@Entity()
export class Cta {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, (page) => page.cta, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  page: Page;

  @Column()
  status: boolean;

  @Column()
  content: string;

  @Column()
  link: string;

  @Column()
  fontSize: string;

  @Column()
  fontColor: string;

  @Column()
  backgroundColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  update(requestDto: CtasRequestDto): void {
    this.status = requestDto.status;
    this.content = requestDto.content;
    this.link = requestDto.link;
    this.fontSize = requestDto.fontSize;
    this.fontColor = requestDto.fontColor;
    this.backgroundColor = requestDto.backgroundColor;
  }
}
