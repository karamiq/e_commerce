import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetRolesBaseDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetRolesDto extends IntersectionType(
  GetRolesBaseDto,
  PaginationQueryDto,
) {}
