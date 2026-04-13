import { Body, Controller, Get, Param, Patch, Post, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() body: { tableId?: string }) {
    return this.service.createOrder(body);
  }

  @Post('items')
  addItem(
    @Body()
    body: {
      orderId: string;
      menuItemId: string;
      quantity: number;
    },
  ) {
    return this.service.addItem(body);
  }

  @Get()
  getAll() {
    return this.service.getOrders();
  }

  @Get('table/:tableId')
  getOpenOrder(@Param('tableId') tableId: string) {
    return this.service.getOpenOrderByTable(tableId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.completeOrder(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancelOrder(id);
  }

  @Delete(':id/items')
  clearItems(@Param('id') id: string) {
    return this.service.clearOrderItems(id);
  }

  @Get('history')
  getOrderHistory(
    @Query('date') date?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getOrderHistory({ date, type, status});
  }
} 