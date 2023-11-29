import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';
import { AwsService } from '../aws/services/aws.service';

@Module({
  controllers: [PagesController],
  providers: [PagesService, AwsService],
})
export class PagesModule {}
