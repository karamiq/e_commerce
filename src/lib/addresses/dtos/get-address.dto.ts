
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetAddressDto extends PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Filter by customer ID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ required: false, description: 'Filter by city ID' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiProperty({ required: false, description: 'Search by address details' })
  @IsOptional()
  @IsString()
  search?: string;
}
