import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, GetEnterpriseParams } from './dto';
import { AuthGuard } from 'src/common/guards';
import { User } from 'src/common/decorators';

@Controller('enterprises')
@UseGuards(AuthGuard)
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  @Post()
  create(@Body() dto: CreateEnterpriseDto) {
    return this.enterprisesService.create(dto);
  }

  @Get()
  findAll(@User() user: any) {
    // Super admin puede ver todas las empresas
    if (user.role === 'super_admin') {
      return this.enterprisesService.findAll();
    }
    // Usuarios normales solo ven su propia empresa
    if (user.enterpriseId) {
      return this.enterprisesService.findOne(user.enterpriseId);
    }
    // Si no tiene empresa ni es super_admin, devuelve array vacío
    return [];
  }

  @Get(':id')
  findOne(@Param() params: GetEnterpriseParams, @User() user: any) {
    // Super admin puede ver cualquier empresa
    if (user.role === 'super_admin') {
      return this.enterprisesService.findOne(params.id);
    }
    // Usuarios normales solo pueden ver su propia empresa
    if (user.enterpriseId && user.enterpriseId !== params.id) {
      throw new ForbiddenException('You can only access your own enterprise');
    }
    return this.enterprisesService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: GetEnterpriseParams,
    @Body() dto: UpdateEnterpriseDto,
    @User() user: any,
  ) {
    // Super admin puede actualizar cualquier empresa
    if (user.role === 'super_admin') {
      return this.enterprisesService.update(params.id, dto);
    }
    // Usuarios normales solo pueden actualizar su propia empresa
    if (user.enterpriseId && user.enterpriseId !== params.id) {
      throw new ForbiddenException('You can only update your own enterprise');
    }
    return this.enterprisesService.update(params.id, dto);
  }

  @Delete(':id')
  remove(@Param() params: GetEnterpriseParams, @User() user: any) {
    // Super admin puede eliminar cualquier empresa
    if (user.role === 'super_admin') {
      return this.enterprisesService.remove(params.id);
    }
    // Usuarios normales solo pueden eliminar su propia empresa
    if (user.enterpriseId && user.enterpriseId !== params.id) {
      throw new ForbiddenException('You can only delete your own enterprise');
    }
    return this.enterprisesService.remove(params.id);
  }
}
