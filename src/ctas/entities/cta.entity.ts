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

  constructor(
    page: Page,
    status: boolean,
    content: string,
    link: string,
    fontSize: string,
    fontColor: string,
    backgroundColor: string,
  ) {
    this.page = page;
    this.status = status;
    this.content = content;
    this.link = link;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.backgroundColor = backgroundColor;
  }

  update(requestDto: CtasRequestDto): void {
    this.status = requestDto.status;
    this.content = requestDto.content;
    this.link = requestDto.link;
    this.fontSize = requestDto.fontSize;
    this.fontColor = requestDto.fontColor;
    this.backgroundColor = requestDto.backgroundColor;
  }
}
