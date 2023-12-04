import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Page } from './entities/page.entity';
import { PagesRepository } from './repositories/pages.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Page]), PassportModule.register({ defaultStrategy: 'jwt' }), AuthModule],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository],
})
export class PagesModule {}
