import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

export class GetEmployeeBaseDto {
  @ApiProperty({
    required: false,
    description: 'Search by employee name or email',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by role name',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class GetEmployeesDto extends IntersectionType(
  GetEmployeeBaseDto,
  PaginationQueryDto,
) { }