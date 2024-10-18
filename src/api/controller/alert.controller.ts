import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from '../../services/core/alert.service';
import { AlertDto } from '../../models/alert.dto';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Set a price alert' })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created',
  })
  async setAlert(@Body() alertData: AlertDto) {
    return this.alertService.setAlert(
      alertData.chain,
      alertData.targetPrice,
      alertData.email,
    );
  }
}
