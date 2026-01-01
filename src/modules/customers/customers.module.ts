import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { UsersModule } from '../users/users.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    PaginationModule,
    TypeOrmModule.forFeature([Customer]),
    UsersModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule { }
