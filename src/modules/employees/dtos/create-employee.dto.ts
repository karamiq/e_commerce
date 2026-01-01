import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateEmployeeBaseDto {
  @ApiProperty({
    description: 'Role ID for the employee',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsUUID('4', { message: 'Invalid role ID format' })
  roleId: string;
}

export class CreateEmployeeDto extends IntersectionType(CreateUserDto, CreateEmployeeBaseDto) {
}