import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';

import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, GetEnterpriseParams } from './dto';

@Controller('enterprises')
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  @Post()
  create(@Body() dto: CreateEnterpriseDto) {
    return this.enterprisesService.create(dto);
  }

  @Get()
  findAll() {
    return this.enterprisesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: GetEnterpriseParams) {
    return this.enterprisesService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: GetEnterpriseParams, @Body() dto: UpdateEnterpriseDto) {
    return this.enterprisesService.update(params.id, dto);
  }

  @Delete(':id')
  remove(@Param() params: GetEnterpriseParams) {
    return this.enterprisesService.remove(params.id);
  }
}
