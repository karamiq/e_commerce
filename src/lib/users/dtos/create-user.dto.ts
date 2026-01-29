import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsPhoneNumber, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 3,
    maxLength: 96,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name must be at least 3 characters long' })
  @MaxLength(96, { message: 'First name must not exceed 96 characters' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 3,
    maxLength: 96,
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  @MaxLength(96, { message: 'Last name must not exceed 96 characters' })
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    minLength: 8,
    maxLength: 96,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(96, { message: 'Email must not exceed 96 characters' })
  @MinLength(8, { message: 'Email must be at least 8 characters long' })
  email: string;

  @ApiProperty({
    description: 'User phone number with country code',
    example: '+9647728833423',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber(undefined, {
    message: "Enter a valid phone number with country code",
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'User password - must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}