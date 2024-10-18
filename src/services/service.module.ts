import { Module } from '@nestjs/common';
import { PrismaService } from './helpers/prisma.service';

const services = [PrismaService];

@Module({
  imports: [],
  controllers: [],
  providers: [...services],
})
export class ServiceModule {}
