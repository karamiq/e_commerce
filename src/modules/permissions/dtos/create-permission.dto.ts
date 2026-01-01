import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission name',
    example: 'create_user',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Permission name is required' })
  @IsString({ message: 'Permission name must be a string' })
  @MinLength(3, { message: 'Permission name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Permission name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows user to create new users in the system',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
