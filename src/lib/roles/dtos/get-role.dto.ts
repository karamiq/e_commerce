import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

class GetRolesBaseDto {
  @ApiProperty({
    required: false,
    description: 'Filter by role name',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetRolesDto extends IntersectionType(
  GetRolesBaseDto,
  PaginationQueryDto
) { }