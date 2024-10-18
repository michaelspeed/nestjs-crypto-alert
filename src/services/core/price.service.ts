import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../helpers/prisma.service';
import { EmailService } from '../helpers/email.service';
import { MoralisService } from '../helpers/moralis.service';
import { AlertService } from './alert.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly moralisService: MoralisService,
    private readonly alertService: AlertService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchAndSavePrices() {
    console.log('fetchAndSavePrices');
    const chains = ['ethereum', 'polygon'];
    for (const chain of chains) {
      const price = await this.moralisService.getPrice(chain);
      await this.savePrice(chain, price);
      await this.checkPriceIncrease(chain);
      await this.alertService.checkAlerts(chain, price);
    }
  }

  async savePrice(chain: string, price: number) {
    return this.prismaService.price.create({
      data: {
        chain,
        price,
      },
    });
  }

  async checkPriceIncrease(chain: string) {
    const currentPrice = await this.prismaService.price.findFirst({
      where: { chain },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oldPrice = await this.prismaService.price.findFirst({
      where: { chain, createdAt: { gte: oneHourAgo } },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (currentPrice && oldPrice) {
      const increasePercentage =
        ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;
      if (increasePercentage > 3) {
        await this.emailService.sendAlert(chain, increasePercentage);
      }
    }
  }

  async getPricesLastDay(chain: string) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prismaService.price.findMany({
      where: { chain, createdAt: { lte: oneDayAgo } },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
