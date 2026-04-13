import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, OrderType } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const completedOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    const totalOrders = completedOrders.length;

    const totalSales = completedOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + Number(item.lineTotal);
      }, 0);
      return sum + orderTotal;
    }, 0);

    const dineInCount = completedOrders.filter(
      (order) => order.type === OrderType.DINE_IN
    ).length;

    const takeoutCount = completedOrders.filter(
      (order) => order.type === OrderType.TAKEAWAY
    ).length;

    const itemMap: Record<string,
      { name: string; quantity: number; revenue: number }> = {};

    for (const order of completedOrders) {
      for (const item of order.items) {
        const key = item.menuItemId;

        if (!itemMap[key]) {
          itemMap[key] = {
            name: item.menuItem.name,
            quantity: 0,
            revenue: 0,
          };
        }
        itemMap[key].quantity += item.quantity;
        itemMap[key].revenue += Number(item.lineTotal);
      }
    }

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalSales,
      totalOrders,
      dineInCount,
      takeoutCount,
      topItems,
    };
  }
}