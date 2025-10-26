import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { AuthGuard } from 'src/common/guards';
import {
  CreateSupplierDto,
  CreateInvoiceDto,
  GetSupplierParams,
  GetInvoiceParams,
  ListInvoicesQuery,
} from './dto';

@Controller('suppliers')
@UseGuards(AuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // ==================== Suppliers ====================
  @Post()
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.createSupplier(dto);
  }

  @Get()
  listSuppliers() {
    return this.suppliersService.listSuppliers();
  }

  @Get(':id')
  getSupplier(@Param() params: GetSupplierParams) {
    return this.suppliersService.getSupplierById(params.id);
  }

  // ==================== Invoices ====================
  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.suppliersService.createInvoice(dto);
  }

  @Get('invoices')
  listInvoices(@Query() query: ListInvoicesQuery) {
    return this.suppliersService.listInvoices(query.restaurantId);
  }

  @Get('invoices/:id')
  getInvoice(@Param() params: GetInvoiceParams) {
    return this.suppliersService.getInvoiceById(params.id);
  }
}
