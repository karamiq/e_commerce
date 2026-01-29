import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { Attribute } from './entity/attribute.entity';
import { AttributeValue } from './entity/attribute-value.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { UpdateProductVariantDto } from './dtos/update-product-variant.dto';
import { CreateAttributeDto } from './dtos/create-attribute.dto';
import { UpdateAttributeDto } from './dtos/update-attribute.dto';
import { CreateAttributeValueDto } from './dtos/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dtos/update-attribute-value.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) { }

  // ============== PRODUCT METHODS ==============

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { sku: createProductDto.sku }
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with SKU ${createProductDto.sku} already exists`);
    }

    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['variants', 'variants.attributeValues', 'variants.attributeValues.attribute']
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(id);

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku }
      });

      if (existingProduct) {
        throw new BadRequestException(`Product with SKU ${updateProductDto.sku} already exists`);
      }
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
  }

  // ============== PRODUCT VARIANT METHODS ==============

  async createProductVariant(createVariantDto: CreateProductVariantDto): Promise<ProductVariant> {
    const product = await this.getProductById(createVariantDto.productId);

    const existingVariant = await this.productVariantRepository.findOne({
      where: { sku: createVariantDto.sku }
    });

    if (existingVariant) {
      throw new BadRequestException(`Product variant with SKU ${createVariantDto.sku} already exists`);
    }

    const variant = this.productVariantRepository.create({
      ...createVariantDto,
      product
    });

    if (createVariantDto.attributeValueIds && createVariantDto.attributeValueIds.length > 0) {
      const attributeValues = await this.attributeValueRepository.find({
        where: { id: In(createVariantDto.attributeValueIds) }
      });

      if (attributeValues.length !== createVariantDto.attributeValueIds.length) {
        throw new BadRequestException('Some attribute values not found');
      }

      variant.attributeValues = attributeValues;
    }

    return await this.productVariantRepository.save(variant);
  }

  async getAllProductVariants(): Promise<ProductVariant[]> {
    return await this.productVariantRepository.find({
      relations: ['product', 'attributeValues', 'attributeValues.attribute']
    });
  }

  async getProductVariantById(id: string): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product', 'attributeValues', 'attributeValues.attribute']
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    return variant;
  }

  async getProductVariantsByProductId(productId: string): Promise<ProductVariant[]> {
    await this.getProductById(productId);
    return await this.productVariantRepository.find({
      where: { productId },
      relations: ['attributeValues', 'attributeValues.attribute']
    });
  }

  async updateProductVariant(id: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariant> {
    const variant = await this.getProductVariantById(id);

    if (updateVariantDto.sku && updateVariantDto.sku !== variant.sku) {
      const existingVariant = await this.productVariantRepository.findOne({
        where: { sku: updateVariantDto.sku }
      });

      if (existingVariant) {
        throw new BadRequestException(`Product variant with SKU ${updateVariantDto.sku} already exists`);
      }
    }

    if (updateVariantDto.productId && updateVariantDto.productId !== variant.productId) {
      await this.getProductById(updateVariantDto.productId);
    }

    if (updateVariantDto.attributeValueIds) {
      const attributeValues = await this.attributeValueRepository.find({
        where: { id: In(updateVariantDto.attributeValueIds) }
      });

      if (attributeValues.length !== updateVariantDto.attributeValueIds.length) {
        throw new BadRequestException('Some attribute values not found');
      }

      variant.attributeValues = attributeValues;
    }

    Object.assign(variant, updateVariantDto);
    return await this.productVariantRepository.save(variant);
  }

  async deleteProductVariant(id: string): Promise<void> {
    const variant = await this.getProductVariantById(id);
    await this.productVariantRepository.remove(variant);
  }

  // ============== ATTRIBUTE METHODS ==============

  async createAttribute(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const existingAttribute = await this.attributeRepository.findOne({
      where: { name: createAttributeDto.name }
    });

    if (existingAttribute) {
      throw new BadRequestException(`Attribute with name ${createAttributeDto.name} already exists`);
    }

    const attribute = this.attributeRepository.create(createAttributeDto);
    return await this.attributeRepository.save(attribute);
  }

  async getAllAttributes(): Promise<Attribute[]> {
    return await this.attributeRepository.find({
      relations: ['values']
    });
  }

  async getAttributeById(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values']
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return attribute;
  }

  async updateAttribute(id: string, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.getAttributeById(id);

    if (updateAttributeDto.name && updateAttributeDto.name !== attribute.name) {
      const existingAttribute = await this.attributeRepository.findOne({
        where: { name: updateAttributeDto.name }
      });

      if (existingAttribute) {
        throw new BadRequestException(`Attribute with name ${updateAttributeDto.name} already exists`);
      }
    }

    Object.assign(attribute, updateAttributeDto);
    return await this.attributeRepository.save(attribute);
  }

  async deleteAttribute(id: string): Promise<void> {
    const attribute = await this.getAttributeById(id);
    await this.attributeRepository.remove(attribute);
  }

  // ============== ATTRIBUTE VALUE METHODS ==============

  async createAttributeValue(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
    const attribute = await this.getAttributeById(createAttributeValueDto.attributeId);

    const attributeValue = this.attributeValueRepository.create({
      ...createAttributeValueDto,
      attribute
    });

    return await this.attributeValueRepository.save(attributeValue);
  }

  async getAllAttributeValues(): Promise<AttributeValue[]> {
    return await this.attributeValueRepository.find({
      relations: ['attribute']
    });
  }

  async getAttributeValueById(id: string): Promise<AttributeValue> {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
      relations: ['attribute']
    });

    if (!attributeValue) {
      throw new NotFoundException(`Attribute value with ID ${id} not found`);
    }

    return attributeValue;
  }

  async getAttributeValuesByAttributeId(attributeId: string): Promise<AttributeValue[]> {
    await this.getAttributeById(attributeId);
    return await this.attributeValueRepository.find({
      where: { attributeId }
    });
  }

  async updateAttributeValue(id: string, updateAttributeValueDto: UpdateAttributeValueDto): Promise<AttributeValue> {
    const attributeValue = await this.getAttributeValueById(id);

    if (updateAttributeValueDto.attributeId && updateAttributeValueDto.attributeId !== attributeValue.attributeId) {
      await this.getAttributeById(updateAttributeValueDto.attributeId);
    }

    Object.assign(attributeValue, updateAttributeValueDto);
    return await this.attributeValueRepository.save(attributeValue);
  }

  async deleteAttributeValue(id: string): Promise<void> {
    const attributeValue = await this.getAttributeValueById(id);
    await this.attributeValueRepository.remove(attributeValue);
  }
}