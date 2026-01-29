import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressIdParamDto {
  @ApiProperty({ description: 'Address UUID', example: '7d3f9ea7-4b92-4f6a-8ef8-19b9c2d6b4d1' })
  @IsUUID()
  addressId: string;
}
