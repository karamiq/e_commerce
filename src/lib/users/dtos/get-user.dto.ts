import { IntersectionType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetUserBaseDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}

export class GetUsersDto extends IntersectionType(
  GetUserBaseDto,
  PaginationQueryDto,
) {}
