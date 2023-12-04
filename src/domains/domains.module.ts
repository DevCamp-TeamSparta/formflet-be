import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entites/domains.entity';
import { DomainsController } from './controllers/domains.controller';
import { DomainsService } from './services/domains.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { DomainsRepository } from './repositories/domains.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Domain]), PassportModule.register({ defaultStrategy: 'jwt' }), AuthModule],
  controllers: [DomainsController],
  providers: [DomainsService, DomainsRepository],
})
export class DomainsModule {}
