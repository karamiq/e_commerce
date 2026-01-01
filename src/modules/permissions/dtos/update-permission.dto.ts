import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Permission name',
    example: 'update_user',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Permission name must be a string' })
  @MinLength(3, { message: 'Permission name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Permission name must not exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows user to update existing users in the system',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
