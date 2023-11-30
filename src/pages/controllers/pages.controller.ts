import { Body, Controller, Post } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { AwsService } from '../../aws/services/aws.service';
import { ResponseEntity } from '../../configs/response-entity';
import { RegisterDomainDto } from '../dtos/requests/register-domain.dto';

@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly awsService: AwsService,
  ) {}

  @Post('/register-domain')
  async registerDomain(@Body() registerDomainDto: RegisterDomainDto): Promise<ResponseEntity<string>> {
    return this.awsService.registerDomain(registerDomainDto);
  }
}
