import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetGovernorateDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
