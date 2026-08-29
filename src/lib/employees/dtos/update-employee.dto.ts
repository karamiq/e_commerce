import { IsUUID, IsOptional } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsUUID('4', { message: 'Invalid role ID format' })
  roleId?: string;
}
