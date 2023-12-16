import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cta } from './entities/cta.entity';
import { PassportModule } from '@nestjs/passport';
import { CtasService } from './services/ctas.service';
import { CtasRepository } from './repositories/ctas.repository';
import { CtasController } from './controllers/ctas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cta]), PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [CtasService, CtasRepository],
  exports: [CtasService],
  controllers: [CtasController],
})
export class CtasModule {}
