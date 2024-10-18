import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

@Injectable()
export class MoralisService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    Moralis.start({
      apiKey: this.configService.get<string>('MORALIS_API_KEY'),
    });
  }

  async getPrice(chain: string): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: this.getTokenAddress(chain),
        chain: this.getChain(chain),
      });
      return response.result.usdPrice;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to fetch price from Moralis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getTokenAddress(chain: string): string {
    // You would need to provide the correct token addresses for each chain
    const addresses = {
      ethereum: this.configService.get<string>('ETH_ADDRESS'),
      polygon: this.configService.get<string>('PLYGON_ADDERESS'),
      bitcoin: this.configService.get<string>('BITCOIN_ADDRESS'),
    };
    return addresses[chain];
  }

  private getChain(chain: string): EvmChain {
    switch (chain) {
      case 'ethereum':
        return EvmChain.ETHEREUM;
      case 'polygon':
        return EvmChain.POLYGON;
      // Using Binance Smart Chain Mainnet
      case 'bitcoin':
        return EvmChain.BSC;
      default:
        throw new HttpException('Chain not supported', HttpStatus.BAD_REQUEST);
    }
  }
}
