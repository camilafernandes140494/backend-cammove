import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { BodyEmail } from './email.types';

@Injectable()
export class EmailService {
  private oAuth2Client;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    this.oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  async sendEmail({ to, subject, body, attachments }: BodyEmail) {
    const accessToken = await this.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_SENDER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      body,
      attachments,
    };

    return transporter.sendMail(mailOptions);
  }

  private async getAccessToken() {
    const { token } = await this.oAuth2Client.getAccessToken();
    return token;
  }
}
