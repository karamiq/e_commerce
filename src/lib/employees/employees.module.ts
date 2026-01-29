import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import Employees from './entities/employees.entity';
import User from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employees, User]), UsersModule, PaginationModule, RolesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule { }