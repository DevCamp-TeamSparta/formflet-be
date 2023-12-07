import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Page } from './entities/pages.entity';
import { PagesRepository } from './repositories/pages.repository';
import { OriginalPagesRepository } from './repositories/original-pages.repository';
import { OriginalPage } from './entities/original-pages.entity';
import { EditPagesRepository } from './repositories/edit-pages.repository';
import { EditPage } from './entities/edit-pages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, OriginalPage, EditPage]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository, OriginalPagesRepository, EditPagesRepository],
})
export class PagesModule {}
