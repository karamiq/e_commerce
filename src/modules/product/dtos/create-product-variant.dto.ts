import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Product ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Variant SKU', example: 'IP15PRO-256-RED' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({ description: 'Additional price for this variant', example: 50.00, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  additionalPrice?: number;

  @ApiPropertyOptional({ description: 'Variant stock quantity', example: 50, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Variant active status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Variant image URL', example: 'https://example.com/variant.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Array of attribute value IDs', example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  attributeValueIds?: string[];
}
