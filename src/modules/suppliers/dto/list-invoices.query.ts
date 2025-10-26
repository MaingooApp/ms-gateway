import { IsOptional, IsUUID } from 'class-validator';

export class ListInvoicesQuery {
  @IsUUID()
  @IsOptional()
  restaurantId?: string;
}
