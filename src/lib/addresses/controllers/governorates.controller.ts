import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddressesService } from '../addresses.service';
import { GetGovernorateDto } from '../dtos/get-governorate.dto';
import { Public } from 'src/lib/auth/decorators/public.decorator';

@Controller('governorates')
export class GovernoratesController {
  constructor(

    private readonly addressesService: AddressesService,) { }

  @Post()
  create(@Body('name') name: string) {
    return this.addressesService.createGovernorate(name);
  }

  @Get()
  @Public()
  findAll(@Query() getGovernoratesDto: GetGovernorateDto) {
    return this.addressesService.listGovernorates(getGovernoratesDto);
  }
}
