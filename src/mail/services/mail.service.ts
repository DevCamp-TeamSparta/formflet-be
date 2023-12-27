import { ConflictException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendHello(): boolean {
    this.mailerService
      .sendMail({
        to: 'jinu0729@gmail.com',
        from: process.env.FORMFLET_MAIL_ADDRESS,
        subject: 'Hello',
        text: 'Hello World',
        html: '<b>Hello World</b>',
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        new ConflictException(error);
      });
    return true;
  }
}
