import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { NATS_SERVICE, envs } from 'src/config';
import type { CreateSupplierDto, CreateInvoiceDto } from './dto';

const SuppliersSubjects = {
  createSupplier: 'suppliers.create',
  getSupplier: 'suppliers.getById',
  listSuppliers: 'suppliers.list',
  deleteSupplier: 'suppliers.delete',

  createInvoice: 'invoices.create',
  getInvoice: 'invoices.getById',
  listInvoices: 'invoices.list',
  deleteInvoice: 'invoices.delete',
  getInvoiceDocumentUrl: 'invoices.getDocumentUrl',
  getMultipleInvoiceDocumentUrls: 'invoices.getMultipleDocumentUrls',
} as const;

@Injectable()
export class SuppliersService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // Suppliers
  async createSupplier(dto: CreateSupplierDto, enterpriseId: string) {
    return this.send(SuppliersSubjects.createSupplier, { ...dto, enterpriseId });
  }

  async getSupplierById(id: string) {
    return this.send(SuppliersSubjects.getSupplier, { id });
  }

  async listSuppliers(enterpriseId: string) {
    return this.send(SuppliersSubjects.listSuppliers, { enterpriseId });
  }

  async deleteSupplier(id: string) {
    return this.send(SuppliersSubjects.deleteSupplier, { id });
  }

  // Invoices
  async createInvoice(dto: CreateInvoiceDto, enterpriseId: string) {
    return this.send(SuppliersSubjects.createInvoice, { ...dto, enterpriseId });
  }

  async getInvoiceById(id: string) {
    return this.send(SuppliersSubjects.getInvoice, { id });
  }

  async listInvoices(enterpriseId?: string) {
    return this.send(SuppliersSubjects.listInvoices, { enterpriseId });
  }

  async deleteInvoice(id: string) {
    return this.send(SuppliersSubjects.deleteInvoice, { id });
  }

  async getInvoiceDocumentUrl(invoiceId: string, expiresInHours?: number) {
    return this.send(SuppliersSubjects.getInvoiceDocumentUrl, {
      invoiceId,
      expiresInHours: expiresInHours || 24,
    });
  }

  async getMultipleInvoiceDocumentUrls(invoiceIds: string[], expiresInHours?: number) {
    return this.send(SuppliersSubjects.getMultipleInvoiceDocumentUrls, {
      invoiceIds,
      expiresInHours: expiresInHours || 48,
    });
  }

  private async send<T>(subject: string, payload: unknown): Promise<T> {
    const observable = this.client.send<T>(subject, payload).pipe(
      timeout(envs.requestTimeoutMs),
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    return await firstValueFrom(observable);
  }
}
