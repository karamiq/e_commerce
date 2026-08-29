import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetCityDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  governorateId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
