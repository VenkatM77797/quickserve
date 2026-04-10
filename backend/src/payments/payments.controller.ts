import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  create(@Body() body: { orderId: string; method: 'CASH' | 'CARD' | 'UPI'; }) {
    return this.service.createPayment(body);
  }

  @Get(':orderId')
  get(@Param('orderId') orderId: string) {
    return this.service.getPayment(orderId);
  }
  async createPayment(body: { orderId: string; method: string }) {
  const { orderId, method } = body;

}
}