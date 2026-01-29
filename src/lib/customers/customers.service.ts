import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { UsersService } from '../users/users.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetCustomersDto } from './dtos/get-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const user = await this.usersService.createUser({
      email: createCustomerDto.email,
      password: createCustomerDto.password,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      phoneNumber: createCustomerDto.phoneNumber,
    },);

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      user: user,
    });
    return await this.customerRepository.save(customer);
  }

  async findAll(getCustomersDto: GetCustomersDto) {
    const { search, status, page, limit } = getCustomersDto;

    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
    // Handle soft delete filtering
    switch (status) {
      case StatusFilter.DELETED:
        query.withDeleted().where('customer.deletedAt IS NOT NULL');
        break;
      case StatusFilter.ALL:
        query.withDeleted();
        break;
      case StatusFilter.ACTIVE:
      default:
        // By default, TypeORM excludes soft-deleted records
        break;
    }

    // Search by name, email, or phone number
    if (search) {
      query.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR user.phoneNumber ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return await this.paginationService.paginateQueryBuilder<Customer>(
      query,
      { page, limit },
    );
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['user', 'addresses', 'selectedDeliveryAddress'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByUserId(userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with user ID ${userId} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }
}
