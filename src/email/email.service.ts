import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { BodyEmail } from './email.types';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // ou 587
      secure: true,
      auth: {
        user: 'app.cammove@gmail.com',
        pass: 'Chiclete140494*',
      },
    });
  }

  async sendEmail(body: BodyEmail) {
    const mailOptions = {
      from: 'app.cammove@gmail.com',
      to: body.to,
      subject: body.subject,
      html: body.body,
      attachments: body.attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error(error); // Adicione um log para depurar
      throw new Error(`Erro ao enviar e-mail: ${error}`);
    }
  }
}
