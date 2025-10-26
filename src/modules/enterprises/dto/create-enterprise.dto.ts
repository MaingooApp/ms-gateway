import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum EntityType {
  RESTAURANT = 'RESTAURANT',
  SUPPLIER = 'SUPPLIER',
}

export class CreateEnterpriseDto {
  @IsEnum(EntityType)
  type!: EntityType;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  cifNif?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  firstPhonePrefix?: string;

  @IsOptional()
  @IsString()
  firstPhoneNumber?: string;

  @IsOptional()
  @IsString()
  secondPhonePrefix?: string;

  @IsOptional()
  @IsString()
  secondPhoneNumber?: string;

  @IsOptional()
  @IsString()
  iban?: string;
}
