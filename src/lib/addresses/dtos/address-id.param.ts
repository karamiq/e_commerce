import { IsUUID } from 'class-validator';

export class AddressIdParamDto {
  @IsUUID()
  addressId: string;
}
