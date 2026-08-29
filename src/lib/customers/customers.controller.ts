import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { GetCustomersDto } from './dtos/get-customer.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type ActiveUserData from '../auth/interfaces/active-user-data.interface';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @PermissionsDeco(PermissionsConstants.customers.create)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return await this.customersService.create(createCustomerDto);
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.customers.read)
  async findAll(@Query() getCustomersDto: GetCustomersDto) {
    const result = await this.customersService.findAll(getCustomersDto);
    return result.data.map((customer) => ({
      id: customer.id,
      email: customer.user?.email,
      firstName: customer.user?.firstName,
      lastName: customer.user?.lastName,
      phoneNumber: customer.user?.phoneNumber,
    }));
  }

  @Get('profile')
  async getProfile(
    @ActiveUser() user: ActiveUserData,
    @Req() req,
  ): Promise<any> {
    const customer = await this.customersService.findByUserId(
      req['user']['sub'],
    );
    return {
      id: customer.id,
      email: customer.user?.email,
      firstName: customer.user?.firstName,
      lastName: customer.user?.lastName,
      phoneNumber: customer.user?.phoneNumber,
      deletedAt: customer.user?.deletedAt,
      createdAt: customer.user?.createAt,
      dateOfBirth: customer.dateOfBirth,
    } as any;
  }

  @Get(':id')
  @PermissionsDeco(PermissionsConstants.customers.read)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    const customer = await this.customersService.findOne(id);
    return {
      id: customer.id,
      email: customer.user?.email,
      firstName: customer.user?.firstName,
      lastName: customer.user?.lastName,
      phoneNumber: customer.user?.phoneNumber,
      createdAt: customer.user?.createAt,
      deletedAt: customer.user?.deletedAt,
    } as any;
  }

  @Patch(':id')
  @PermissionsDeco(PermissionsConstants.customers.update)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customersService.update(id, updateCustomerDto);
  }
}
