import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateAllergenDto } from './dto';
import { AuthGuard } from 'src/common/guards';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Products
  @Post()
  createProduct(@Body() data: CreateProductDto) {
    return this.productsService.createProduct(data);
  }

  @Get()
  findAllProducts(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('allergenId') allergenId?: string,
  ) {
    return this.productsService.findAllProducts({ search, categoryId, allergenId });
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  // Categories
  @Post('categories')
  createCategory(@Body() data: CreateCategoryDto) {
    return this.productsService.createCategory(data);
  }

  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.productsService.findOneCategory(id);
  }

  // Allergens
  @Post('allergens')
  createAllergen(@Body() data: CreateAllergenDto) {
    return this.productsService.createAllergen(data);
  }

  @Get('allergens')
  findAllAllergens() {
    return this.productsService.findAllAllergens();
  }
}
