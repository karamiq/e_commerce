import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Date of birth must be a valid date in ISO format (YYYY-MM-DD)',
    },
  )
  dateOfBirth?: string;
}
