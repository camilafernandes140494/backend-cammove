import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body() { to, subject, body, attachments }: { to: string[], subject: string, body: string, attachments?: any[] }
  ) {
    return this.emailService.sendEmail(to, subject, body, attachments);
  }
}
