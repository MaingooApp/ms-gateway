import { IsString } from 'class-validator';

export class GetSupplierParams {
  @IsString()
  id!: string;
}
