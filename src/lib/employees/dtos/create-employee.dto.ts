import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateEmployeeBaseDto {
  @ApiProperty({
    description: 'Role ID for the employee',
    example: '8c4261e7-2c68-42ce-ba92-d2b9cf14462a',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsUUID('4', { message: 'Invalid role ID format' })
  roleId: string;
}

export class CreateEmployeeDto extends IntersectionType(CreateUserDto, CreateEmployeeBaseDto) {
}