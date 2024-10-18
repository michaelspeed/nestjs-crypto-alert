import { ApiProperty } from '@nestjs/swagger';

export class AlertDto {
  @ApiProperty()
  chain: string;
  @ApiProperty()
  targetPrice: number;
  @ApiProperty()
  email: string;
}
