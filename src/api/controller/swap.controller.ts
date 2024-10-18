import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { SwapService } from '../../services/core/swap.service';

@ApiTags('swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('eth-to-btc')
  @ApiOperation({ summary: 'Get swap rate from ETH to BTC' })
  @ApiResponse({ status: 200, description: 'Returns the swap rate and fees' })
  async getSwapRate(@Query('amount') amount: number) {
    return this.swapService.getSwapRate(amount);
  }
}
