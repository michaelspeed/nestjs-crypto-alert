import { Module } from '@nestjs/common';
import { ServiceModule } from '../services/service.module';
import { PriceController } from './controller/price.controller';
import { SwapController } from './controller/swap.controller';
import { AlertController } from './controller/alert.controller';

const controllers = [PriceController, SwapController, AlertController];

@Module({
  imports: [ServiceModule],
  controllers: [...controllers],
  providers: [],
})
export class ApiModule {}
