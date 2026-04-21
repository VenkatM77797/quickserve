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
import { Roles, AppRole } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔥 apply globally
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  create(@Body() body: { tableId?: string }) {
    return this.service.createOrder(body);
  }

  @Post('items')
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
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
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  getAll() {
    return this.service.getOrders();
  }

  @Get('table/:tableId')
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  getOpenOrder(@Param('tableId') tableId: string) {
    return this.service.getOpenOrderByTable(tableId);
  }

  @Patch(':id/complete')
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  complete(@Param('id') id: string) {
    return this.service.completeOrder(id);
  }

  @Patch(':id/cancel')
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  cancel(@Param('id') id: string) {
    return this.service.cancelOrder(id);
  }

  @Delete(':id/items')
  @Roles(AppRole.EMPLOYEE, AppRole.MANAGER)
  clearItems(@Param('id') id: string) {
    return this.service.clearOrderItems(id);
  }

  @Get('history')
  @Roles(AppRole.MANAGER)
  getOrderHistory(
    @Query('date') date?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getOrderHistory({ date, type, status });
  }
}