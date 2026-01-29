import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { AddressIdParamDto } from "./dtos/address-id.param";
import { CreateAddressDto } from "./dtos/create-address.dto";
import { GetCustomerAddressesParamsDto } from "./dtos/get-customer-addresses.params";
import { SelectDeliveryParamsDto } from "./dtos/select-delivery.params";
import { SetDefaultParamsDto } from "./dtos/set-default.params";


@Controller()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Post('addresses')
  createAddress(@Body() dto: CreateAddressDto) {
    return this.addressesService.createAddressForCustomer(dto);
  }

  @Get('customers/:customerId/addresses')
  listCustomerAddresses(@Param() params: GetCustomerAddressesParamsDto) {
    return this.addressesService.listCustomerAddresses(params.customerId);
  }

  @Patch('customers/:customerId/addresses/:addressId/default')
  setDefaultAddress(@Param() params: SetDefaultParamsDto) {
    return this.addressesService.setDefaultAddress(params.customerId, params.addressId);
  }

  @Patch('customers/:customerId/addresses/:addressId/select')
  selectDeliveryAddress(@Param() params: SelectDeliveryParamsDto) {
    return this.addressesService.selectDeliveryAddress(params.customerId, params.addressId);
  }

  @Delete('addresses/:addressId')
  deleteAddress(@Param() params: AddressIdParamDto) {
    return this.addressesService.deleteAddress(params.addressId);
  }
}
