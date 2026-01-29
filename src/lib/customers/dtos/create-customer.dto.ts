import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateCustomerBaseDto {
  @ApiProperty({
    description: 'Customer shipping address',
    example: '123 Main St, City, State 12345',
  })
  @IsNotEmpty({ message: 'Shipping address is required' })
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress: string;

  @ApiProperty({
    description: 'Customer date of birth',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date in ISO format (YYYY-MM-DD)' })
  dateOfBirth?: string;
}

export class CreateCustomerDto extends IntersectionType(CreateUserDto, CreateCustomerBaseDto) {
}
