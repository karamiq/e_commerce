import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entites/address.entity';
import { City } from './entites/city.entity';
import { Governorate } from './entites/governorate.entity';
import { Customer } from '../customers/entities/customer.entity';
import { AddressesService } from './addresses.service';
import { GovernoratesController } from './controllers/governorates.controller';
import { CitiesController } from './controllers/cities.controller';

import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address, City, Governorate, Customer]), PaginationModule],
  controllers: [AddressesController, GovernoratesController, CitiesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule { }