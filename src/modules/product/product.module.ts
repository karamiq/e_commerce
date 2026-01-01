import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "./entity/product.entity";
import { ProductVariant } from "./entity/product-variant.entity";
import { Attribute } from "./entity/attribute.entity";
import { AttributeValue } from "./entity/attribute-value.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      Attribute,
      AttributeValue
    ])
  ],
  controllers: [
    ProductController
  ],
  providers: [
    ProductService
  ],
  exports: [
    ProductService,
    TypeOrmModule
  ],
})
export class ProductModule { }
