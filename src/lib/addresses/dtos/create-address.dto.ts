import { IsBoolean, IsOptional, IsString, Length, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Customer UUID', example: 'abca0d93-5a9d-441b-96b7-e2f3a6f137c5' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'City UUID', example: '6f1a2b34-9e8f-4d3a-8c7b-2a1b3c4d5e6f' })
  @IsUUID()
  cityId: string;

  @ApiProperty({ description: 'Street line', example: 'Karrada, Street 10, House 22' })
  @IsString()
  @Length(1, 255)
  street: string;

  @ApiPropertyOptional({ description: 'Building/Apt info', example: 'Building A, Apt 5' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  building?: string;

  @ApiPropertyOptional({ description: 'Delivery notes', example: 'Leave at reception; call on arrival' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Mark as default address', example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
