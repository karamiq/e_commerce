import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'manager',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  @MinLength(3, { message: 'Role name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Role name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Manager role with administrative privileges',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'List of permission IDs associated with the role',
    example: ['uuid1', 'uuid2'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true, message: 'Each permission ID must be a string' })
  permissionIds: string[];
}