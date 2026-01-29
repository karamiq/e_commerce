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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { CreateEmployeeBaseDto, CreateEmployeeDto } from './dtos/create-employee.dto';
import Employees from './entities/employees.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetEmployeesDto } from './dtos/get-employee.dto';
import { UpdateEmployeeRoleDto } from './dtos/update-employee-role.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';
@ApiTags('employees')
@ApiBearerAuth('access-token')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  @PermissionsDeco(PermissionsConstants.employees.create)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee has been successfully created.',
    type: Employees,
  })
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employees> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.employees.read)
  @ApiOperation({ summary: 'Search and filter employees' })
  @ApiResponse({
    status: 200,
    description: 'List of filtered employees with pagination.',
  })
  async findAll(@Query() getEmployeesDto: GetEmployeesDto) {
    const result = await this.employeesService.findAll(getEmployeesDto);
    const merged = Array.isArray(result.data)
    return result.data.map((employee) => ({
      id: employee.id,
      createdAt: (employee as any).createdAt,
      deletedAt: (employee as any).deletedAt,
      email: employee.user?.email,
      firstName: employee.user?.firstName,
      lastName: employee.user?.lastName,
      phoneNumber: employee.user?.phoneNumber,
      role: employee.role ?? null,
    }))

  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.employees.read)
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiResponse({
    status: 200,
    description: 'Employee found.',
    type: Employees,
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Employees> {
    const employee = await this.employeesService.findOne(id);
    return {
      id: employee.id,
      createdAt: (employee as any).createdAt,
      deletedAt: (employee as any).deletedAt,
      email: employee.user?.email,
      firstName: employee.user?.firstName,
      lastName: employee.user?.lastName,
      phoneNumber: employee.user?.phoneNumber,
      role: employee.role ?? null,
    } as any;
  }
  @Patch(':id')
  @PermissionsDeco(PermissionsConstants.employees.update)
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiResponse({
    status: 200,
    description: 'Employee has been successfully updated.',
    type: Employees,
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employees> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @Patch(':id/role')
  @PermissionsDeco(PermissionsConstants.employees.update)
  @ApiOperation({ summary: 'Update employee role' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiResponse({
    status: 200,
    description: 'Employee role has been successfully updated.',
    type: Employees,
  })
  @ApiResponse({ status: 404, description: 'Employee or role not found.' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeRoleDto: UpdateEmployeeRoleDto,
  ): Promise<Employees> {
    return await this.employeesService.update(id, updateEmployeeRoleDto);
  }


  @Delete(':id/permanent')
  @PermissionsDeco(PermissionsConstants.employees.delete)
  @ApiOperation({ summary: 'Permanently delete an employee' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiResponse({ status: 200, description: 'Employee has been permanently deleted.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async deletePermanently(@Param('id', ParseUUIDPipe) id: string) {
    const employee = await this.employeesService.deletePermanently(id);
    return {
      id: employee.id,
      permanentlyDeleted: true,
    };
  }

}
