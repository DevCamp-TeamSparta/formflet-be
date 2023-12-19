import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Page } from './entities/page.entity';
import { PagesRepository } from './repositories/pages.repository';
import { PageDetail } from './entities/page-detail.entity';
import { PageFont } from './entities/page-font.entity';
import { PagesFontService } from './services/pages-font.service';
import { PagesFontRepository } from './repositories/pages-font.repository';
import { PagesDetailService } from './services/pages-detail.service';
import { PagesDetailRepository } from './repositories/pages-detail.repository';
import { FormsModule } from '../forms/forms.module';
import { CtasModule } from '../ctas/ctas.module';
import { PagesResponseDto } from './controllers/dto/responses/pages-response.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageDetail, PageFont]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    FormsModule,
    CtasModule,
  ],
  controllers: [PagesController],
  providers: [
    PagesService,
    PagesRepository,
    PagesDetailService,
    PagesDetailRepository,
    PagesFontService,
    PagesFontRepository,
    PagesResponseDto,
  ],
})
export class PagesModule {}
