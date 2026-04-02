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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetCustomersDto } from './dtos/get-customer.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type ActiveUserData from '../auth/interfaces/active-user-data.interface';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { create } from 'domain';

@ApiTags('customers')
@ApiBearerAuth('access-token')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  @PermissionsDeco(PermissionsConstants.customers.create)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer has been successfully created.',
    type: Customer,
  })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customersService.create(createCustomerDto);
  }

  @Get()
  @PermissionsDeco(PermissionsConstants.customers.read)
  @ApiOperation({ summary: 'Search and filter customers' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: StatusFilter,
    description: 'Filter by status (active, deleted, or all)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by customer name, email, or phone number',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of filtered customers with pagination.',
  })
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
  @ApiOperation({ summary: 'Get current customer profile' })
  @ApiResponse({
    status: 200,
    description: 'Current customer profile.',

  })
  async getProfile(@ActiveUser() user: ActiveUserData, @Req() req): Promise<any> {

    console.log('Current User in getProfile:', req.user);
    const customer = await this.customersService.findByUserId(req['user']['sub']);
    return {
      id: customer.id,
      email: customer.user?.email,
      firstName: customer.user?.firstName,
      lastName: customer.user?.lastName,
      phoneNumber: customer.user?.phoneNumber,
      deletedAt: customer.user?.deletedAt,
      createdAt: customer.user?.createAt,
      dateOfBirth: customer.dateOfBirth
    } as any;
  }
  @Get(':id')
  @PermissionsDeco(PermissionsConstants.customers.read)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found.',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
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
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({
    status: 200,
    description: 'Customer has been successfully updated.',
    type: Customer,
  })

  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customersService.update(id, updateCustomerDto);
  }


}
