import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { text } from 'stream/consumers';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 587),
      secure: false, // user SSL or TLS (for production envaiorment)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: `"No Reply" <${process.env.EMIL_FROM}>`,
      to,
      subject,
      text: content,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
