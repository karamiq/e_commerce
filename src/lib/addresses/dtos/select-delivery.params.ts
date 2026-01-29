import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectDeliveryParamsDto {
  @ApiProperty({ description: 'Customer UUID', example: 'abca0d93-5a9d-441b-96b7-e2f3a6f137c5' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Selected Address UUID', example: '7d3f9ea7-4b92-4f6a-8ef8-19b9c2d6b4d1' })
  @IsUUID()
  addressId: string;
}
