import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttributeDto {
  @ApiProperty({ description: 'Attribute name', example: 'Color' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Attribute description', example: 'Product color options' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Attribute active status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
