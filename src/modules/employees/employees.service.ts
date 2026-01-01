import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import Employees from './entities/employees.entity';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UsersService } from '../users/users.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetEmployeesDto } from './dtos/get-employee.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeeRepository: Repository<Employees>,

    private readonly paginationService: PaginationService,
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employees> {
    const role = await this.rolesService.findOne(createEmployeeDto.roleId);

    const user = await this.userService.createUser({
      email: createEmployeeDto.email,
      password: createEmployeeDto.password,
      firstName: createEmployeeDto.firstName,
      lastName: createEmployeeDto.lastName,
      phoneNumber: createEmployeeDto.phoneNumber,
    },);

    const employee = this.employeeRepository.create({
      role: role,
      user: user,
    });
    console.log('Created Employee:', employee);

    return await this.employeeRepository.save(employee);
  }

  async findAll(getEmployeesDto: GetEmployeesDto) {
    const { search, role, status, page, limit } = getEmployeesDto;

    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.role', 'role');

    // Handle soft delete filtering
    switch (status) {
      case StatusFilter.DELETED:
        query.withDeleted().where('employee.deletedAt IS NOT NULL');
        break;
      case StatusFilter.ALL:
        query.withDeleted();
        break;
      case StatusFilter.ACTIVE:
      default:
        // By default, TypeORM excludes soft-deleted records
        break;
    }
    // Search by name or email
    if (search) {
      query.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by role name
    if (role) {
      query.andWhere('role.name = :role', { role });
    }

    return await this.paginationService.paginateQueryBuilder<Employees>(
      query,
      { page, limit },
    );
  }

  async findOne(id: string): Promise<Employees> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findByUserId(userId: string): Promise<Employees> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'role', 'role.permissions'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with user ID ${userId} not found`);
    }
    return employee;
  }

  async findByEmail(email: string): Promise<Employees> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { email } },
      relations: ['user', 'role', 'role.permissions'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employees> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.roleId) {
      const role = await this.rolesService.findOne(updateEmployeeDto.roleId);
      employee.role = role;
    }

    return await this.employeeRepository.save(employee);
  }
}
