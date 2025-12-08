import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateAllergenDto,
  UpdateAllergenDto,
} from './dto';
import { AuthGuard } from 'src/common/guards';
import { User } from 'src/common/decorators';
import { CurrentUser } from 'src/common';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Products
  @Post()
  createProduct(@Body() data: CreateProductDto, @User() user: CurrentUser) {
    return this.productsService.createProduct(data, user.enterpriseId!);
  }

  @Get()
  findAllProducts(
    @User() user: CurrentUser,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('allergenId') allergenId?: string,
  ) {
    return this.productsService.findAllProducts(user.enterpriseId!, {
      search,
      categoryId,
      allergenId,
    });
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

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
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

  @Get('allergens/:id')
  findOneAllergen(@Param('id') id: string) {
    return this.productsService.findOneAllergen(id);
  }

  @Patch('allergens/:id')
  updateAllergen(@Param('id') id: string, @Body() data: UpdateAllergenDto) {
    return this.productsService.updateAllergen(id, data);
  }

  @Delete('allergens/:id')
  deleteAllergen(@Param('id') id: string) {
    return this.productsService.deleteAllergen(id);
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string, @User() user: CurrentUser) {
    return this.productsService.findOneProduct(id, user.enterpriseId);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
