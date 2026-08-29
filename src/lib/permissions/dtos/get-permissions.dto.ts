import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetPermissionsBaseDto {
  name: string;
}

export class GetPermissionsDto extends IntersectionType(
  GetPermissionsBaseDto,
  PaginationQueryDto,
) {}
