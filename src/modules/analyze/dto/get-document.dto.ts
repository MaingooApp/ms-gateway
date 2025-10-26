import { IsString } from 'class-validator';

export class GetDocumentParams {
  @IsString()
  id!: string;
}
