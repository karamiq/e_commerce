import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";

export enum StatusFilter {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ALL = 'all',
}

export class PaginationQueryDto {
  @ApiProperty({
    title: 'Page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    title: 'Limit',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({
    title: 'Status',
    description: 'Filter by status (active, deleted, or all)',
    enum: StatusFilter,
    required: false,
    default: StatusFilter.ACTIVE,
    example: StatusFilter.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusFilter)
  status?: StatusFilter = StatusFilter.ACTIVE;
}