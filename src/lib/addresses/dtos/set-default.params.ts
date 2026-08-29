import { IsUUID } from 'class-validator';

export class SetDefaultParamsDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  addressId: string;
}
