import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: ['uuid1', 'uuid2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}