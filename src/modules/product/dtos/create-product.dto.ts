import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Latest Apple smartphone' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Stock Keeping Unit', example: 'IP15PRO-256-BLK' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiProperty({ description: 'Base price of the product', example: 999.99 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ description: 'Initial stock quantity', example: 100, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Product active status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Product image URL', example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;
}
