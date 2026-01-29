import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerAddressesParamsDto {
  @ApiProperty({ description: 'Customer UUID', example: 'abca0d93-5a9d-441b-96b7-e2f3a6f137c5' })
  @IsUUID()
  customerId: string;
}
