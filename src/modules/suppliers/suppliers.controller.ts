import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { AuthGuard } from 'src/common/guards';
import { User } from 'src/common/decorators';
import { CreateSupplierDto, CreateInvoiceDto, GetSupplierParams, GetInvoiceParams } from './dto';

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

  // ==================== Invoices ====================
  // IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto, @User() user: any) {
    return this.suppliersService.createInvoice(dto, user.enterpriseId);
  }

  @Get('invoices')
  listInvoices(@User() user: any) {
    return this.suppliersService.listInvoices(user.enterpriseId);
  }

  @Get('invoices/:id')
  getInvoice(@Param() params: GetInvoiceParams) {
    return this.suppliersService.getInvoiceById(params.id);
  }

  // Esta ruta debe ir al FINAL porque captura cualquier string como :id
  @Get(':id')
  getSupplier(@Param() params: GetSupplierParams) {
    return this.suppliersService.getSupplierById(params.id);
  }
}
