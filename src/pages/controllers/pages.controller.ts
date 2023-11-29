import { Body, Controller, Post } from '@nestjs/common';
import { PagesService } from '../services/pages.service';
import { RegisterDomainDto } from '../dtos/requests/register-domain.dto';
import { AwsService } from '../../aws/services/aws.service';

@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly awsService: AwsService,
  ) {}

  @Post('/register-domain')
  registerDomain(@Body() registerDomainDto: RegisterDomainDto) {
    return this.awsService.registerDomain(registerDomainDto);
  }
}
