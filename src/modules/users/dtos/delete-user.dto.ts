import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserDto {
  @ApiProperty({ description: 'Unique identifier of the user to delete', format: 'uuid' })
  id: string;
}
