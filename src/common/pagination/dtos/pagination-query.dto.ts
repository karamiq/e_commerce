import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

export enum StatusFilter {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ALL = 'all',
}

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsEnum(StatusFilter)
  status?: StatusFilter = StatusFilter.ACTIVE;
}
