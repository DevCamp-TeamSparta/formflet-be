import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainsService } from '../services/domains.service';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { DomainsRequestDto } from './dtos/requests/domains-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { DomainsResponseDto } from './dtos/responses/domains-response.dto';

@Controller('domains')
@UseGuards(AuthGuard())
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post('/register')
  async registerDomain(
    @GetUser() user: User,
    @Body() domainsRequestDto: DomainsRequestDto,
  ): Promise<ResponseEntity<DomainsResponseDto>> {
    return this.domainsService.registerDomain(user, domainsRequestDto);
  }
}
