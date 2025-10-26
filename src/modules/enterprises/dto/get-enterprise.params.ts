import { IsUUID } from 'class-validator';

export class GetEnterpriseParams {
  @IsUUID()
  id!: string;
}
