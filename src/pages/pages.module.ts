import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Page } from './entities/page.entity';
import { PagesRepository } from './repositories/pages.repository';
import { PageBackup } from './entities/page-backup.entity';
import { PageContent } from './entities/page-content.entity';
import { FontStyle } from './entities/font-style.entity';
import { PagesSupportService } from './services/pages-support.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageBackup, PageContent, FontStyle]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesSupportService, PagesRepository],
})
export class PagesModule {}
