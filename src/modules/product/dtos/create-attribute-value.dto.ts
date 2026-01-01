import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttributeValueDto {
  @ApiProperty({ description: 'Attribute ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty({ description: 'Attribute value', example: 'Red' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Attribute value active status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
