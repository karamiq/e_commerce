import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeRoleDto {
  @ApiProperty({
    description: 'The UUID of the role to assign to the employee',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
