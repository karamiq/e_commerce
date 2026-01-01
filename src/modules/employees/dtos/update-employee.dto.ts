import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({
    description: 'Role ID for the employee',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid role ID format' })
  roleId?: string;
}