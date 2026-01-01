import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

export class GetCustomerBaseDto {
  @ApiProperty({
    required: false,
    description: 'Search by customer name, email, or phone number',
    type: 'string',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}

export class GetCustomersDto extends IntersectionType(
  GetCustomerBaseDto,
  PaginationQueryDto,
) { }
