import { IsOptional, IsUUID, IsString } from 'class-validator';

export class ListInvoicesQuery {
  @IsUUID()
  @IsOptional()
  enterpriseId?: string;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  productId?: string;
}
