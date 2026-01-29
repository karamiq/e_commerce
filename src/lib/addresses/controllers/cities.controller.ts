import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddressesService } from '../addresses.service';
import { Public } from 'src/lib/auth/decorators/public.decorator';

@Controller('cities')
export class CitiesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Post()
  create(@Body('name') name: string, @Body('governorateId') governorateId: string) {
    return this.addressesService.createCity(name, governorateId);
  }


  @Get()
  @Public()
  findAll(@Query('governorateId') governorateId?: string) {
    return this.addressesService.listCities(governorateId);
  }
}
