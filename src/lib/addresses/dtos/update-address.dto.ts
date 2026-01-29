import { IsBoolean, IsOptional, IsString, Length, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiPropertyOptional({ description: 'New city UUID', example: '6f1a2b34-9e8f-4d3a-8c7b-2a1b3c4d5e6f' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiPropertyOptional({ description: 'Updated street line', example: 'Al-Mansour, Street 5' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  street?: string;

  @ApiPropertyOptional({ description: 'Updated building/apartment', example: 'Tower B, Apt 12' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  building?: string;

  @ApiPropertyOptional({ description: 'Updated delivery notes', example: 'Call 5 minutes prior' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Set as default address', example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
