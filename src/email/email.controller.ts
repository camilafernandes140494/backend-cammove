import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

export type BodyEmail = {
  to: string[];
  subject: string;
  body: string;
  attachments?: { filename: string; path: string; contentType?: string }[];
};

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() emailDto: BodyEmail) {
    await this.emailService.sendEmail(emailDto);
    return { message: 'Email enviado com sucesso' };
  }
}
