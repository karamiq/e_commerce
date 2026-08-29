import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetEmployeeBaseDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class GetEmployeesDto extends IntersectionType(
  GetEmployeeBaseDto,
  PaginationQueryDto,
) {}
