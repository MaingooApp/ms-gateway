import { IsString } from 'class-validator';

export class GetInvoiceParams {
  @IsString()
  id!: string;
}
