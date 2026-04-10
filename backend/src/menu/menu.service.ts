import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; price: number; categoryId: string }) {
    return this.prisma.menuItem.create({
      data,
    });
  }

  findAll() {
    return this.prisma.menuItem.findMany({
      include: { category: true },
    });
  }
}