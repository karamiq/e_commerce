import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { UpdateProductVariantDto } from './dtos/update-product-variant.dto';
import { CreateAttributeDto } from './dtos/create-attribute.dto';
import { UpdateAttributeDto } from './dtos/update-attribute.dto';
import { CreateAttributeValueDto } from './dtos/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dtos/update-attribute-value.dto';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // ============== PRODUCT ENDPOINTS ==============

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  // ============== PRODUCT VARIANT ENDPOINTS ==============

  @Post('variants')
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({ status: 201, description: 'Product variant created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProductVariant(@Body() createVariantDto: CreateProductVariantDto) {
    return await this.productService.createProductVariant(createVariantDto);
  }

  @Get('variants/all')
  @ApiOperation({ summary: 'Get all product variants' })
  @ApiResponse({ status: 200, description: 'Product variants retrieved successfully' })
  async getAllProductVariants() {
    return await this.productService.getAllProductVariants();
  }

  @Get(':productId/variants')
  @ApiOperation({ summary: 'Get all variants for a specific product' })
  @ApiResponse({ status: 200, description: 'Product variants retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductVariantsByProductId(@Param('productId') productId: string) {
    return await this.productService.getProductVariantsByProductId(productId);
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get product variant by ID' })
  @ApiResponse({ status: 200, description: 'Product variant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async getProductVariantById(@Param('id') id: string) {
    return await this.productService.getProductVariantById(id);
  }

  @Put('variants/:id')
  @ApiOperation({ summary: 'Update product variant by ID' })
  @ApiResponse({ status: 200, description: 'Product variant updated successfully' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async updateProductVariant(@Param('id') id: string, @Body() updateVariantDto: UpdateProductVariantDto) {
    return await this.productService.updateProductVariant(id, updateVariantDto);
  }

  @Delete('variants/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product variant by ID' })
  @ApiResponse({ status: 204, description: 'Product variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async deleteProductVariant(@Param('id') id: string) {
    return await this.productService.deleteProductVariant(id);
  }

  // ============== ATTRIBUTE ENDPOINTS ==============

  @Post('attributes')
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({ status: 201, description: 'Attribute created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAttribute(@Body() createAttributeDto: CreateAttributeDto) {
    return await this.productService.createAttribute(createAttributeDto);
  }

  @Get('attributes/all')
  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({ status: 200, description: 'Attributes retrieved successfully' })
  async getAllAttributes() {
    return await this.productService.getAllAttributes();
  }

  @Get('attributes/:id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async getAttributeById(@Param('id') id: string) {
    return await this.productService.getAttributeById(id);
  }

  @Put('attributes/:id')
  @ApiOperation({ summary: 'Update attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute updated successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async updateAttribute(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return await this.productService.updateAttribute(id, updateAttributeDto);
  }

  @Delete('attributes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attribute by ID' })
  @ApiResponse({ status: 204, description: 'Attribute deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async deleteAttribute(@Param('id') id: string) {
    return await this.productService.deleteAttribute(id);
  }

  // ============== ATTRIBUTE VALUE ENDPOINTS ==============

  @Post('attribute-values')
  @ApiOperation({ summary: 'Create a new attribute value' })
  @ApiResponse({ status: 201, description: 'Attribute value created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAttributeValue(@Body() createAttributeValueDto: CreateAttributeValueDto) {
    return await this.productService.createAttributeValue(createAttributeValueDto);
  }

  @Get('attribute-values/all')
  @ApiOperation({ summary: 'Get all attribute values' })
  @ApiResponse({ status: 200, description: 'Attribute values retrieved successfully' })
  async getAllAttributeValues() {
    return await this.productService.getAllAttributeValues();
  }

  @Get('attributes/:attributeId/values')
  @ApiOperation({ summary: 'Get all values for a specific attribute' })
  @ApiResponse({ status: 200, description: 'Attribute values retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async getAttributeValuesByAttributeId(@Param('attributeId') attributeId: string) {
    return await this.productService.getAttributeValuesByAttributeId(attributeId);
  }

  @Get('attribute-values/:id')
  @ApiOperation({ summary: 'Get attribute value by ID' })
  @ApiResponse({ status: 200, description: 'Attribute value retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  async getAttributeValueById(@Param('id') id: string) {
    return await this.productService.getAttributeValueById(id);
  }

  @Put('attribute-values/:id')
  @ApiOperation({ summary: 'Update attribute value by ID' })
  @ApiResponse({ status: 200, description: 'Attribute value updated successfully' })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  async updateAttributeValue(@Param('id') id: string, @Body() updateAttributeValueDto: UpdateAttributeValueDto) {
    return await this.productService.updateAttributeValue(id, updateAttributeValueDto);
  }

  @Delete('attribute-values/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attribute value by ID' })
  @ApiResponse({ status: 204, description: 'Attribute value deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  async deleteAttributeValue(@Param('id') id: string) {
    return await this.productService.deleteAttributeValue(id);
  }
}