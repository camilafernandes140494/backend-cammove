import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { BodyEmail } from './email.types';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body()
    body: BodyEmail,
  ) {
    return this.emailService.sendEmail(body);
  }
}
