import { Controller, Post } from '@nestjs/common';
import { MailService } from '../services/mail.service';

@Controller('/api/mail')
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  @Post('test')
  async emailConfirm() {
    return this.mailerService.sendHello();
  }
}
