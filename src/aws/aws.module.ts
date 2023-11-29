import { Module } from '@nestjs/common';
import { AwsService } from './services/aws.service';

@Module({
  providers: [AwsService],
})
export class AwsModule {}
