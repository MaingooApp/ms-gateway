import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import { NATS_SERVICE, envs } from 'src/config';
import {
  CreateAllergenDto,
  CreateCategoryDto,
  CreateProductDto,
  UpdateAllergenDto,
  UpdateCategoryDto,
  UpdateProductDto,
} from './dto';

enum ProductsSubjects {
  create = 'products.create',
  findAll = 'products.findAll',
  findOne = 'products.findOne',
  update = 'products.update',
  delete = 'products.delete',
  createCategory = 'categories.create',
  findAllCategories = 'categories.findAll',
  findOneCategory = 'categories.findOne',
  updateCategory = 'categories.update',
  deleteCategory = 'categories.delete',
  createAllergen = 'allergens.create',
  findAllAllergens = 'allergens.findAll',
  findOneAllergen = 'allergens.findOne',
  updateAllergen = 'allergens.update',
  deleteAllergen = 'allergens.delete',
}

@Injectable()
export class ProductsService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // Products
  createProduct(data: CreateProductDto) {
    return this.send(ProductsSubjects.create, data);
  }

  findAllProducts(filters?: { search?: string; categoryId?: string; allergenId?: string }) {
    return this.send(ProductsSubjects.findAll, filters || {});
  }

  findOneProduct(id: string) {
    return this.send(ProductsSubjects.findOne, { id });
  }

  updateProduct(id: string, data: UpdateProductDto) {
    return this.send(ProductsSubjects.update, { id, data });
  }

  deleteProduct(id: string) {
    return this.send(ProductsSubjects.delete, { id });
  }

  // Categories
  createCategory(data: CreateCategoryDto) {
    return this.send(ProductsSubjects.createCategory, data);
  }

  findAllCategories() {
    return this.send(ProductsSubjects.findAllCategories, {});
  }

  findOneCategory(id: string) {
    return this.send(ProductsSubjects.findOneCategory, { id });
  }

  updateCategory(id: string, data: UpdateCategoryDto) {
    return this.send(ProductsSubjects.updateCategory, { id, data });
  }

  deleteCategory(id: string) {
    return this.send(ProductsSubjects.deleteCategory, { id });
  }

  // Allergens
  createAllergen(data: CreateAllergenDto) {
    return this.send(ProductsSubjects.createAllergen, data);
  }

  findAllAllergens() {
    return this.send(ProductsSubjects.findAllAllergens, {});
  }

  findOneAllergen(id: string) {
    return this.send(ProductsSubjects.findOneAllergen, { id });
  }

  updateAllergen(id: string, data: UpdateAllergenDto) {
    return this.send(ProductsSubjects.updateAllergen, { id, data });
  }

  deleteAllergen(id: string) {
    return this.send(ProductsSubjects.deleteAllergen, { id });
  }

  private async send<T>(subject: string, payload: unknown): Promise<T> {
    return await firstValueFrom(
      this.client.send<T>(subject, payload).pipe(timeout(envs.requestTimeoutMs)),
    );
  }
}
