import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetCustomerBaseDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}

export class GetCustomersDto extends IntersectionType(
  GetCustomerBaseDto,
  PaginationQueryDto,
) {}
