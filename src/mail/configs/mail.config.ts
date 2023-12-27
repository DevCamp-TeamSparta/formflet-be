import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  smtp: 'smtp-relay.gmail.com',
  smtp_id: process.env.FORMFLET_MAIL_ADDRESS,
  smtp_pw: process.env.FORMFLET_MAIL_PASSWORD,
  smtp_ssl: true,
  smtp_port: 465,
  smtp_from_name: 'formflet',
  smtp_from_email: process.env.FORMFLET_MAIL_ADDRESS,
  privkey: process.env.FORMFLET_PRIVKEY,
}));
