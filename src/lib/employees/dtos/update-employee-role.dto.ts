import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeRoleDto {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
