import * as nodemailer from 'nodemailer';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      // Configure your email transport here
      // Note: Nodemailer is not configured
    });
  }

  async sendAlert(chain: string, increasePercentage: number) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('email.from'),
        to: this.configService.get<string>('email.to'),
        subject: `Price Alert: ${chain} increased by ${increasePercentage.toFixed(2)}%`,
        text: `The price of ${chain} has increased by ${increasePercentage.toFixed(2)}% in the last hour.`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('Error sending email! NodeMailer has not been configured', e);
    }
  }

  async sendPriceAlert(email: string, chain: string, currentPrice: number) {
    console.log(`Sending Price alert`);
    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: `Price Alert: ${chain} reached target price`,
      text: `The price of ${chain} has reached your target price. Current price: $${currentPrice.toFixed(2)}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
