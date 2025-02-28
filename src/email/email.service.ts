import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // ou outro serviço de e-mail como SendGrid, Mailgun
      auth: {
        user: 'app.cammove@gmail.com',
        pass: process.env.EMAIL,
      },
    });
  }

  async sendEmail(to: string[], subject: string, body: string, attachments?: any[]) {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to,
      subject,
      html: body,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }
  }
}
