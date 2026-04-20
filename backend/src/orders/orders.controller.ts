import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔥 apply globally
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @Roles('EMPLOYEE', 'MANAGER')
  create(@Body() body: { tableId?: string }) {
    return this.service.createOrder(body);
  }

  @Post('items')
  @Roles('EMPLOYEE', 'MANAGER')
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
  @Roles('EMPLOYEE', 'MANAGER')
  getAll() {
    return this.service.getOrders();
  }

  @Get('table/:tableId')
  @Roles('EMPLOYEE', 'MANAGER')
  getOpenOrder(@Param('tableId') tableId: string) {
    return this.service.getOpenOrderByTable(tableId);
  }

  @Patch(':id/complete')
  @Roles('EMPLOYEE', 'MANAGER')
  complete(@Param('id') id: string) {
    return this.service.completeOrder(id);
  }

  @Patch(':id/cancel')
  @Roles('EMPLOYEE', 'MANAGER')
  cancel(@Param('id') id: string) {
    return this.service.cancelOrder(id);
  }

  @Delete(':id/items')
  @Roles('EMPLOYEE', 'MANAGER')
  clearItems(@Param('id') id: string) {
    return this.service.clearOrderItems(id);
  }

  @Get('history')
  @Roles('MANAGER') // 🔥 only manager
  getOrderHistory(
    @Query('date') date?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getOrderHistory({ date, type, status });
  }
}