import { Module } from '@nestjs/common';
import { PrismaService } from './helpers/prisma.service';
import { AlertService } from './core/alert.service';
import { EmailService } from './helpers/email.service';
import { MoralisService } from './helpers/moralis.service';
import { SwapService } from './core/swap.service';
import { PriceService } from './core/price.service';

const services = [
  PrismaService,
  AlertService,
  EmailService,
  MoralisService,
  SwapService,
  PriceService,
];

@Module({
  imports: [],
  controllers: [],
  providers: [...services],
  exports: [...services],
})
export class ServiceModule {}
