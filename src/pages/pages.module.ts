import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Page } from './entities/pages.entity';
import { PagesRepository } from './repositories/pages.repository';
import { PagesDetailRepository } from './repositories/pages-detail.repository';
import { PageDetail } from './entities/pages-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageDetail]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository, PagesDetailRepository],
})
export class PagesModule {}
