import { Injectable } from '@nestjs/common';
import { PrismaService } from '../helpers/prisma.service';
import { EmailService } from '../helpers/email.service';

@Injectable()
export class AlertService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async setAlert(chain: string, targetPrice: number, email: string) {
    return this.prismaService.alert.create({
      data: {
        chain,
        targetPrice,
        email,
      },
    });
  }

  async checkAlerts(chain: string, currentPrice: number) {
    const alerts = await this.prismaService.alert.findMany({
      where: {
        chain,
      },
    });
    for (const alert of alerts) {
      if (alert.targetPrice < currentPrice) {
        console.log('sending alert');
        // Implemented in such a way because the email service is not configured
        try {
          await this.emailService.sendPriceAlert(
            alert.email,
            chain,
            currentPrice,
          );
        } finally {
          await this.prismaService.alert.delete({
            where: {
              id: alert.id,
            },
          });
        }
      }
    }
  }
}
