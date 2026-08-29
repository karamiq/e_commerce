import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';

export class CreateAddressDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  cityId: string;

  @IsString()
  @Length(1, 255)
  street: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  building?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
