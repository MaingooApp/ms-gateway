import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitInvoiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
