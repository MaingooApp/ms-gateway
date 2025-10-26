import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EntityType } from './create-enterprise.dto';

export class UpdateEnterpriseDto {
  @IsOptional()
  @IsEnum(EntityType)
  type?: EntityType;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  name?: string;

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
