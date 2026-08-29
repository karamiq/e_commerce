import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  street?: string;

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
