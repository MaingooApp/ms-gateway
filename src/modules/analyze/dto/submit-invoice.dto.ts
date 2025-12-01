import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class SubmitInvoiceDto {
  @IsString()
  documentType!: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasDeliveryNotes!: boolean;
}
