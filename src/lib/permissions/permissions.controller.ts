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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { Permissions } from './entities/permissions.entity';
import { GetPermissionsDto } from './dtos/get-permissions.dto';
import { PermissionsDeco as PermissionsDecorator } from './decorators/permissions.decorator';
import { PermissionsConstants } from './constants/permissions.constants';

@ApiTags('permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @PermissionsDecorator(PermissionsConstants.permissions.create)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Permission has been successfully created.',
    type: Permissions,
  })
  @ApiResponse({ status: 409, description: 'Permission with this name already exists.' })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permissions> {
    return await this.permissionsService.create(
      createPermissionDto.name,
      createPermissionDto.description,
    );
  }

  @Get()
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'List of all permissions.',
    type: [Permissions],
  })
  async findAll(@Query() getPermissionsDto: GetPermissionsDto) {
    return await this.permissionsService.findAll(getPermissionsDto);
  }

  @Get(':id')
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Permission details.',
    type: Permissions,
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Permissions> {
    return await this.permissionsService.findOne(id);
  }
  @Patch(':id')
  @PermissionsDecorator(PermissionsConstants.permissions.update)
  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Permission has been successfully updated.',
    type: Permissions,
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 409, description: 'Permission with this name already exists.' })
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
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Permission has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.permissionsService.remove(id);
  }

  @Get('role-permissions/:roleId')
  @PermissionsDecorator(PermissionsConstants.permissions.read)
  @ApiOperation({ summary: 'Get permissions by Role ID' })
  @ApiParam({ name: 'roleId', description: 'Role UUID' })
  async getPermissionsByRoleId(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return await this.permissionsService.getPermissionsByRoleId(roleId);
  }
}
