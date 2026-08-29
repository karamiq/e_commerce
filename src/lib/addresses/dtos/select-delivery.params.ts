import { IsUUID } from 'class-validator';

export class SelectDeliveryParamsDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  addressId: string;
}
