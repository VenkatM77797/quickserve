import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [TablesModule, PrismaModule, CategoriesModule, MenuModule, OrdersModule, PaymentsModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService, MenuService],
})
export class AppModule {}
