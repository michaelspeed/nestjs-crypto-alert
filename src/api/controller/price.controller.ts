import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { PriceService } from '../../services/core/price.service';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':chain/last-day')
  @ApiOperation({ summary: 'Get prices for the last 24 hours' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of price data points',
  })
  async getPricesLastDay(@Param('chain') chain: string) {
    return this.priceService.getPricesLastDay(chain);
  }
}
