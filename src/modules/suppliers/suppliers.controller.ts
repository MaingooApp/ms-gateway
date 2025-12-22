import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { AuthGuard } from 'src/common/guards';
import { User } from 'src/common/decorators';
import type { CurrentUser } from 'src/common';
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
  createSupplier(@Body() dto: CreateSupplierDto, @User() user: CurrentUser) {
    return this.suppliersService.createSupplier(dto, user.enterpriseId);
  }

  @Get()
  listSuppliers(@User() user: CurrentUser) {
    return this.suppliersService.listSuppliers(user.enterpriseId);
  }

  // ==================== Invoices ====================
  // IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto, @User() user: CurrentUser) {
    return this.suppliersService.createInvoice(dto, user.enterpriseId);
  }

  @Get('invoices')
  listInvoices(@User() user: CurrentUser, @Query() query: ListInvoicesQuery) {
    return this.suppliersService.listInvoices({
      enterpriseId: user.enterpriseId,
      supplierId: query.supplierId,
      productId: query.productId,
    });
  }

  @Post('invoices/document-urls')
  getMultipleInvoiceDocumentUrls(@Body() body: { invoiceIds: string[]; expiresInHours?: number }) {
    return this.suppliersService.getMultipleInvoiceDocumentUrls(
      body.invoiceIds,
      body.expiresInHours,
    );
  }

  @Get('invoices/:id/document-url')
  getInvoiceDocumentUrl(
    @Param() params: GetInvoiceParams,
    @Query('expiresInHours') expiresInHours?: string,
  ) {
    const hours = expiresInHours ? parseInt(expiresInHours, 10) : 24;
    return this.suppliersService.getInvoiceDocumentUrl(params.id, hours);
  }

  @Get('invoices/:id')
  getInvoice(@Param() params: GetInvoiceParams) {
    return this.suppliersService.getInvoiceById(params.id);
  }

  @Delete('invoices/:id')
  deleteInvoice(@Param() params: GetInvoiceParams) {
    return this.suppliersService.deleteInvoice(params.id);
  }

  @Get(':id')
  getSupplier(@Param() params: GetSupplierParams) {
    return this.suppliersService.getSupplierById(params.id);
  }

  @Delete(':id')
  deleteSupplier(@Param() params: GetSupplierParams) {
    return this.suppliersService.deleteSupplier(params.id);
  }
}
