import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import type { CreateSupplierDto, CreateInvoiceDto } from './dto';

const SuppliersSubjects = {
  createSupplier: 'suppliers.create',
  getSupplier: 'suppliers.getById',
  listSuppliers: 'suppliers.list',

  createInvoice: 'invoices.create',
  getInvoice: 'invoices.getById',
  listInvoices: 'invoices.list',
} as const;

@Injectable()
export class SuppliersService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // Suppliers
  async createSupplier(dto: CreateSupplierDto) {
    return firstValueFrom(this.client.send(SuppliersSubjects.createSupplier, dto));
  }

  async getSupplierById(id: string) {
    return firstValueFrom(this.client.send(SuppliersSubjects.getSupplier, { id }));
  }

  async listSuppliers() {
    return firstValueFrom(this.client.send(SuppliersSubjects.listSuppliers, {}));
  }

  // Invoices
  async createInvoice(dto: CreateInvoiceDto, enterpriseId: string) {
    return firstValueFrom(
      this.client.send(SuppliersSubjects.createInvoice, { ...dto, enterpriseId }),
    );
  }

  async getInvoiceById(id: string) {
    return firstValueFrom(this.client.send(SuppliersSubjects.getInvoice, { id }));
  }

  async listInvoices(enterpriseId?: string) {
    return firstValueFrom(this.client.send(SuppliersSubjects.listInvoices, { enterpriseId }));
  }
}
