import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer shipping address',
    example: '123 Main St, City, State 12345',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress?: string;

  @ApiProperty({
    description: 'Customer date of birth',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date in ISO format (YYYY-MM-DD)' })
  dateOfBirth?: string;
}
