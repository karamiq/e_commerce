
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetGovernorateDto extends PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Search by governorate name' })
  @IsOptional()
  @IsString()
  search?: string;
}
