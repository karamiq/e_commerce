import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateCustomerBaseDto {
  @IsNotEmpty({ message: 'Shipping address is required' })
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Date of birth must be a valid date in ISO format (YYYY-MM-DD)',
    },
  )
  dateOfBirth?: string;
}

export class CreateCustomerDto extends IntersectionType(
  CreateUserDto,
  CreateCustomerBaseDto,
) {}
