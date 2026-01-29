import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Address } from './entites/address.entity';
import { City } from './entites/city.entity';
import { Governorate } from './entites/governorate.entity';
import { Customer } from '../customers/entities/customer.entity';
import { GetGovernorateDto } from './dtos/get-governorate.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
    @InjectRepository(City) private readonly cityRepo: Repository<City>,
    @InjectRepository(Governorate) private readonly governorateRepo: Repository<Governorate>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    private readonly paginationService: PaginationService
  ) { }

  async createGovernorate(name: string): Promise<Governorate> {
    const existing = await this.governorateRepo.findOne({ where: { name } });
    if (existing) throw new BadRequestException('Governorate already exists');
    const gov = this.governorateRepo.create({ name });
    return this.governorateRepo.save(gov);
  }
  async listGovernorates(getGovernoratesDto: GetGovernorateDto) {
    return this.paginationService.paginate<Governorate>(
      getGovernoratesDto,
      this.governorateRepo,
      getGovernoratesDto.search ? {
        name: ILike(`%${getGovernoratesDto.search}%`)
      } : undefined
    );
  }
  async createCity(name: string, governorateId: string): Promise<City> {
    const governorate = await this.governorateRepo.findOne({ where: { id: governorateId } });
    if (!governorate) throw new NotFoundException('Governorate not found');
    const existing = await this.cityRepo.findOne({ where: { name, governorate: { id: governorateId } } });
    if (existing) throw new BadRequestException('City already exists in governorate');
    const city = this.cityRepo.create({ name, governorate });
    return this.cityRepo.save(city);
  }

  async listCities(governorateId?: string): Promise<City[]> {
    if (governorateId) {
      return this.cityRepo.find({ where: { governorate: { id: governorateId } }, order: { name: 'ASC' } });
    }
    return this.cityRepo.find({ order: { name: 'ASC' } });
  }

  async createAddressForCustomer(params: {
    customerId: string;
    cityId: string;
    street: string;
    building?: string;
    notes?: string;
    isDefault?: boolean;
  }): Promise<Address> {
    const customer = await this.customerRepo.findOne({ where: { id: params.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    const city = await this.cityRepo.findOne({ where: { id: params.cityId } });
    if (!city) throw new NotFoundException('City not found');

    const address = this.addressRepo.create({
      city,
      street: params.street,
      notes: params.notes,
    });
    address.customer = customer;
    if (params.building !== undefined) {
      (address as any).building = params.building;
    }
    return this.addressRepo.save(address);
  }

  async listCustomerAddresses(customerId: string): Promise<Address[]> {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.addressRepo.find({ where: { customer: { id: customerId } } });
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
    const address = await this.addressRepo.findOne({ where: { id: addressId }, relations: { customer: true } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.customer.id !== customerId) throw new BadRequestException('Address does not belong to customer');

    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    await this.customerRepo.save(customer);
  }

  async selectDeliveryAddress(customerId: string, addressId: string): Promise<void> {
    const address = await this.addressRepo.findOne({ where: { id: addressId }, relations: { customer: true } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.customer.id !== customerId) throw new BadRequestException('Address does not belong to customer');

    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.selectedDeliveryAddress = address as any;
    await this.customerRepo.save(customer);
  }

  async deleteAddress(addressId: string): Promise<void> {
    const address = await this.addressRepo.findOne({ where: { id: addressId } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.remove(address);
  }
}
