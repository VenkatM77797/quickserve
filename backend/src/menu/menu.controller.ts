import { Body, Controller, Get, Post } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu-items')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  @Post()
  create(@Body() body: { name: string; price: number; categoryId: string }) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}