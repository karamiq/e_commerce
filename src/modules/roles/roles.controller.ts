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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Roles } from './entities/roles.entity';
import { GetRolesDto } from './dtos/get-role.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { UpdateRolePermissionsDto } from './dtos/update-role-permissions.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@ApiTags('roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly paginationService: PaginationService,
  ) { }

  @Post()
  @PermissionsDeco(PermissionsConstants.roles.create)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 409, description: 'Role with this name already exists.' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Roles> {
    return await this.rolesService.create(
      createRoleDto
    );
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.roles.read)
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(@Query() getRolesDto: GetRolesDto) {
    return await this.rolesService.findAll(getRolesDto);
  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.roles.read)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({
    status: 200,
    description: 'Role found.',
    type: Roles,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Roles> {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @PermissionsDeco(PermissionsConstants.roles.update)
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role has been successfully updated.',
    type: Roles,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 409, description: 'Role with this name already exists.' })
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
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({
    status: 200,
    description: 'Role has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.remove(id);
  }

  @Patch(':roleId/permissions/add')
  @PermissionsDeco(PermissionsConstants.roles.update)
  @ApiOperation({ summary: 'Add permissions to a role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID' })
  @ApiBody({ type: UpdateRolePermissionsDto })
  @ApiResponse({ status: 200, description: 'Permissions added successfully.' })
  @ApiResponse({ status: 404, description: 'Role or permissions not found.' })
  async addPermissionsToRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto
  ) {
    return await this.rolesService.addPermissionsToRole(roleId, updateRolePermissionsDto.permissionIds);
  }

  @Patch(':roleId/permissions/remove')
  @PermissionsDeco(PermissionsConstants.roles.update)
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID' })
  @ApiBody({ type: UpdateRolePermissionsDto })
  @ApiResponse({ status: 200, description: 'Permissions removed successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async removePermissionsFromRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto
  ) {
    return await this.rolesService.removePermissionsFromRole(roleId, updateRolePermissionsDto.permissionIds);
  }


}
