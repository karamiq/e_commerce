import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

class GetPermissionsBaseDto {
  @ApiProperty({
    required: false,
    description: 'Filter by permission name',
    type: 'string',
  })
  name: string;
}

export class GetPermissionsDto extends IntersectionType(
  GetPermissionsBaseDto,
  PaginationQueryDto,
) { }