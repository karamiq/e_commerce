import { IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateEmployeeBaseDto {
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsUUID('4', { message: 'Invalid role ID format' })
  roleId: string;
}

export class CreateEmployeeDto extends IntersectionType(
  CreateUserDto,
  CreateEmployeeBaseDto,
) {}
