import { IsUUID } from 'class-validator';

export class GetCustomerAddressesParamsDto {
  @IsUUID()
  customerId: string;
}
