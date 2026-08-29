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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Roles } from './entities/roles.entity';
import { GetRolesDto } from './dtos/get-role.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { UpdateRolePermissionsDto } from './dtos/update-role-permissions.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @PermissionsDeco(PermissionsConstants.roles.create)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Roles> {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.roles.read)
  async findAll(@Query() getRolesDto: GetRolesDto) {
    return await this.rolesService.findAll(getRolesDto);
  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.roles.read)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Roles> {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @PermissionsDeco(PermissionsConstants.roles.update)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Roles> {
    return await this.rolesService.update(
      id,
      updateRoleDto.name,
      updateRoleDto.description,
    );
  }

  @Delete(':id')
  @PermissionsDeco(PermissionsConstants.roles.delete)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.remove(id);
  }

  @Patch(':roleId/permissions/add')
  @PermissionsDeco(PermissionsConstants.roles.update)
  async addPermissionsToRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return await this.rolesService.addPermissionsToRole(
      roleId,
      updateRolePermissionsDto.permissionIds,
    );
  }

  @Patch(':roleId/permissions/remove')
  @PermissionsDeco(PermissionsConstants.roles.update)
  async removePermissionsFromRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return await this.rolesService.removePermissionsFromRole(
      roleId,
      updateRolePermissionsDto.permissionIds,
    );
  }
}
