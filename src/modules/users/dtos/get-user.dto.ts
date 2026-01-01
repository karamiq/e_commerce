import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class GetUserBaseDto {
  @ApiProperty({
    required: false,
    description: 'Search by user name, email, or phone number',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}

export class GetUsersDto extends IntersectionType(
  GetUserBaseDto,
  PaginationQueryDto,
) { }