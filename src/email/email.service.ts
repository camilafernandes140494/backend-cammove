import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { BodyEmail } from './email.types';

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

  async sendEmail(body: BodyEmail) {
    const mailOptions = {
      from: 'app.cammove@gmail.com',
      to: body.attachments,
      subject: body.subject,
      html: body.body,
      attachments: body.attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }
  }
}
