import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  
  async createOrder(data: { tableId?: string }) {
    const order = await this.prisma.order.create({
      data: {
        tableId: data.tableId ?? null,
        type: data.tableId ? 'DINE_IN' : 'TAKEAWAY',
        status: 'OPEN',
      },
    });

    if (data.tableId) {
      await this.prisma.restaurantTable.update({
        where: {id: data.tableId},
        data: {status: 'OCCUPIED'},
      });
    }
    return order;
  }

  async addItem(data: {
    orderId: string;
    menuItemId: string;
    quantity: number;
  }) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: data.menuItemId },
    });

    if (!menuItem) throw new BadRequestException('Item not found');

    const unitPrice = Number(menuItem.price);
    const lineTotal = unitPrice * data.quantity;

    return this.prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        menuItemId: data.menuItemId,
        quantity: data.quantity,
        unitPrice,
        lineTotal,
      },
    });
  }

  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        table: true,
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOpenOrderByTable(tableId: string) {
  return this.prisma.order.findFirst({
    where: {
      tableId,
      status: "OPEN",
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });
}

  async completeOrder(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.COMPLETED },
    });
  }

  async cancelOrder(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }
  
  async clearOrderItems(orderId: string) {
  return this.prisma.orderItem.deleteMany({
    where: { orderId },
  });
}

  async getOrderHistory(filters: {
    date?: string;
    type?: string;
    status?: string;
  }) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.date) {
      const start = new Date(filters.date);
      const end = new Date(filters.date);
      end.setDate(end.getDate()+1);

      where.createdAt = {
        gte: start,
        lt: end,
      };
    }

    return this.prisma.order.findMany({
      where,
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }
}
