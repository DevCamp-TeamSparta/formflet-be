import { Module } from '@nestjs/common';
import { FormsController } from './controllers/forms.controller';
import { FormsService } from './services/forms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Form } from './entities/forms.entity';
import { FormDetail } from './entities/forms-detail.entity';
import { FormReply } from './entities/forms-reply.entity';
import { FormsRepository } from './repositories/forms.repository';
import { FormsDetailService } from './services/forms-detail.service';
import { FormsDetailRepository } from './repositories/forms-detail.repository';
import { FormsReplyService } from './services/forms-reply.service';
import { FormsReplyRepository } from './repositories/forms-reply.repository';
import { FormsUtils } from './utils/forms.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormDetail, FormReply]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [FormsController],
  providers: [
    FormsService,
    FormsRepository,
    FormsDetailService,
    FormsDetailRepository,
    FormsReplyService,
    FormsReplyRepository,
    FormsUtils,
  ],
  exports: [FormsService, FormsDetailService, FormsReplyService, FormsUtils],
})
export class FormsModule {}
