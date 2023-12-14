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
import { PageFont } from './entities/page-font.entity';
import { PagesUtil } from './utills/pages.util';
import { PagesBackupService } from './services/pages-backup.service';
import { PagesBackupRepository } from './repositories/pages-backup.repository';
import { PagesFontService } from './services/pages-font.service';
import { PagesFontRepository } from './repositories/pages-font.repository';
import { PagesContentService } from './services/pages-content.service';
import { PagesContentRepository } from './repositories/pages-content.repository';
import { FormsModule } from '../forms/forms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageBackup, PageContent, PageFont]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    FormsModule,
  ],
  controllers: [PagesController],
  providers: [
    PagesService,
    PagesRepository,
    PagesBackupService,
    PagesBackupRepository,
    PagesContentService,
    PagesContentRepository,
    PagesFontService,
    PagesFontRepository,
    PagesUtil,
  ],
})
export class PagesModule {}
