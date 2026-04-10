import { Body, Get, Patch, Post, Controller, Param } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TableStatus } from '@prisma/client';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) {}

    @Post()
    createTable(@Body() body: {tableNumber: number; capacity: number}) {
        return this.tablesService.createTable(body);
    }

    @Get()
    getAlltables() {
        return this.tablesService.getAllTables();
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() body:{status: TableStatus},
    ) {
        return this.tablesService.updateStatus(id, body.status);
    }
}
