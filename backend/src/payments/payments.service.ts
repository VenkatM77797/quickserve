import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: {
    orderId: string;
    method: 'CASH' | 'CARD' | 'UPI';
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: { items: true, payment: true },
    });

    if (!order) throw new BadRequestException('Order not found');

    if (order.payment) {
      throw new BadRequestException('Already paid');
    }

    const total = order.items.reduce(
      (sum, item) => sum + Number(item.lineTotal),0, );

    const payment = await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        method: data.method,
        amount: total,
      },
    });

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    if (order.tableId) {
      await this.prisma.restaurantTable.update({
        where: { id: order.tableId },
        data: { status: 'AVAILABLE' },
      });
    }
    return payment;
  }

  async getPayment(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }
}