import { Injectable } from '@nestjs/common';
import { MoralisService } from '../helpers/moralis.service';

@Injectable()
export class SwapService {
  constructor(private moralisService: MoralisService) {}

  async getSwapRate(ethAmount: number) {
    const ethPrice = await this.moralisService.getPrice('ethereum');
    const btcPrice = await this.moralisService.getPrice('bitcoin');

    const ethValue = ethAmount * ethPrice;
    const btcAmount = ethValue / btcPrice;

    const feePercentage = 0.03;
    const feeEth = ethAmount * feePercentage;
    const feeDollar = feeEth * ethPrice;

    return {
      btcAmount,
      fee: {
        eth: feeEth,
        dollar: feeDollar,
      },
    };
  }
}
