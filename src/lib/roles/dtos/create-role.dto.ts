import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  @MinLength(3, { message: 'Role name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Role name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ each: true, message: 'Each permission ID must be a string' })
  permissionIds: string[];
}
