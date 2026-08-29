import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersDto } from './dtos/get-user.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @PermissionsDeco(PermissionsConstants.users.read)
  async getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.getUsers(getUsersDto);
  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.users.read)
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Delete('soft/:id')
  @PermissionsDeco(PermissionsConstants.users.delete)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Delete('hard/:id')
  @PermissionsDeco(PermissionsConstants.users.delete)
  async hardDeleteUser(@Param('id') id: string) {
    return this.usersService.hardRemove(id);
  }
}
