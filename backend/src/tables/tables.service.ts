import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {TableStatus} from '@prisma/client';

@Injectable()
export class TablesService {
    constructor(private prisma: PrismaService) {}

    async createTable(data: { tableNumber: number; capacity: number }) {
        return this.prisma.restaurantTable.create({
            data: {
                tableNumber: data.tableNumber,
                capacity: data.capacity,
            },
        });
    }

    async getAllTables() {
  const tables = await this.prisma.restaurantTable.findMany({
    orderBy: { tableNumber: 'asc' },
    include: {
      orders: {
        where: {
          status: 'OPEN',   // only active order
        },
        include: {
          items: {
            include: {
              menuItem: true, 
            },
          },
        },
      },
    },
  });

  return tables.map((t) => ({
    ...t,
    currentOrder: t.orders[0] || null,
  }));
}
    async updateStatus(id: string, status: TableStatus) {
        return this.prisma.restaurantTable.update({
            where: {id},
            data: {status},
        });
    }
}
