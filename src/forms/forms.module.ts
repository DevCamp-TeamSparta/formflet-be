import { Module } from '@nestjs/common';
import { FormsController } from './controllers/forms.controller';
import { FormsService } from './services/forms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Form } from './entities/forms.entity';
import { FormDetail } from './entities/forms-detail.entity';
import { FormResponse } from './entities/forms-response.entity';
import { FormsRepository } from './repositories/forms.repository';
import { FormsDetailService } from './services/forms-detail.service';
import { FormsDetailRepository } from './repositories/forms-detail.repository';
import { FormsResponseService } from './services/forms-response.service';
import { FormsResponseRepository } from './repositories/forms-response.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormDetail, FormResponse]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [FormsController],
  providers: [
    FormsService,
    FormsRepository,
    FormsDetailService,
    FormsDetailRepository,
    FormsResponseService,
    FormsResponseRepository,
  ],
  exports: [FormsService, FormsDetailService, FormsResponseService],
})
export class FormsModule {}
