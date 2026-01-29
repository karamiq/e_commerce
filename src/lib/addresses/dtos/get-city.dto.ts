
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetCityDto extends PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Filter by governorate ID' })
  @IsOptional()
  @IsUUID()
  governorateId?: string;

  @ApiProperty({ required: false, description: 'Search by city name' })
  @IsOptional()
  @IsString()
  search?: string;
}
