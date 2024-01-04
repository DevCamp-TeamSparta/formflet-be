import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ResponseEntity } from '../../configs/response-entity';

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger('MailService');

  constructor(private readonly mailerService: MailerService) {}

  sendVerifyEmail(email: string, code: number): ResponseEntity<string> {
    this.logger.log('sendVerificationEmail');

    this.mailerService
      .sendMail({
        to: email,
        subject: '[formflet] 이메일 인증입니다.',
        template: './verify-template',
        context: {
          code: code,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });

    return ResponseEntity.OK('이메일 발송 완료');
  }
}
