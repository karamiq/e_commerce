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
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import Employees from './entities/employees.entity';
import { GetEmployeesDto } from './dtos/get-employee.dto';
import { UpdateEmployeeRoleDto } from './dtos/update-employee-role.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @PermissionsDeco(PermissionsConstants.employees.create)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employees> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.employees.read)
  async findAll(@Query() getEmployeesDto: GetEmployeesDto) {
    const result = await this.employeesService.findAll(getEmployeesDto);
    return result.data.map((employee) => ({
      id: employee.id,
      createdAt: (employee as any).createdAt,
      deletedAt: (employee as any).deletedAt,
      email: employee.user?.email,
      firstName: employee.user?.firstName,
      lastName: employee.user?.lastName,
      phoneNumber: employee.user?.phoneNumber,
      role: employee.role ?? null,
    }));
  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.employees.read)
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employees> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @Patch(':id/role')
  @PermissionsDeco(PermissionsConstants.employees.update)
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeRoleDto: UpdateEmployeeRoleDto,
  ): Promise<Employees> {
    return await this.employeesService.update(id, updateEmployeeRoleDto);
  }

  @Delete(':id/permanent')
  @PermissionsDeco(PermissionsConstants.employees.delete)
  async deletePermanently(@Param('id', ParseUUIDPipe) id: string) {
    const employee = await this.employeesService.deletePermanently(id);
    return {
      id: employee.id,
      permanentlyDeleted: true,
    };
  }
}
