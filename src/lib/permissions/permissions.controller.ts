import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { Permissions } from './entities/permissions.entity';
import { GetPermissionsDto } from './dtos/get-permissions.dto';
import { PermissionsDeco as PermissionsDecorator } from './decorators/permissions.decorator';
import { PermissionsConstants } from './constants/permissions.constants';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @PermissionsDecorator(PermissionsConstants.permissions.create)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permissions> {
    return await this.permissionsService.create(
      createPermissionDto.name,
      createPermissionDto.description,
    );
  }

  @Get()
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  async findAll(@Query() getPermissionsDto: GetPermissionsDto) {
    return await this.permissionsService.findAll(getPermissionsDto);
  }

  @Get(':id')
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Permissions> {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @PermissionsDecorator(PermissionsConstants.permissions.update)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permissions> {
    return await this.permissionsService.update(
      id,
      updatePermissionDto.name,
      updatePermissionDto.description,
    );
  }

  @Delete(':id')
  @PermissionsDecorator(PermissionsConstants.permissions.delete)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.permissionsService.remove(id);
  }

  @Get('role-permissions/:roleId')
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  async getPermissionsByRoleId(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return await this.permissionsService.getPermissionsByRoleId(roleId);
  }
}
