import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { Attribute } from './entity/attribute.entity';
import { AttributeValue } from './entity/attribute-value.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let variantRepository: Repository<ProductVariant>;
  let attributeRepository: Repository<Attribute>;
  let attributeValueRepository: Repository<AttributeValue>;

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    description: 'Test Description',
    sku: 'TEST-SKU-001',
    basePrice: 99.99,
    stockQuantity: 100,
    isActive: true,
    imageUrl: 'https://example.com/image.jpg',
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductRepository = {
    create: jest.fn().mockReturnValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    find: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(mockProduct),
  };

  const mockVariantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAttributeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAttributeValueRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: mockVariantRepository,
        },
        {
          provide: getRepositoryToken(Attribute),
          useValue: mockAttributeRepository,
        },
        {
          provide: getRepositoryToken(AttributeValue),
          useValue: mockAttributeValueRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    variantRepository = module.get<Repository<ProductVariant>>(getRepositoryToken(ProductVariant));
    attributeRepository = module.get<Repository<Attribute>>(getRepositoryToken(Attribute));
    attributeValueRepository = module.get<Repository<AttributeValue>>(getRepositoryToken(AttributeValue));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-SKU-001',
        basePrice: 99.99,
        stockQuantity: 100,
        isActive: true,
        imageUrl: 'https://example.com/image.jpg',
      };

      mockProductRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.createProduct(createProductDto);

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { sku: createProductDto.sku },
      });
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException if SKU already exists', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-SKU-001',
        basePrice: 99.99,
      };

      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        'Product with SKU TEST-SKU-001 already exists',
      );
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result = await service.getAllProducts();

      expect(productRepository.find).toHaveBeenCalledWith({
        relations: ['variants', 'variants.attributeValues', 'variants.attributeValues.attribute'],
      });
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const result = await service.getProductById(mockProduct.id);

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['variants', 'variants.attributeValues', 'variants.attributeValues.attribute'],
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.getProductById('non-existent-id')).rejects.toThrow(
        'Product with ID non-existent-id not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        basePrice: 149.99,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductRepository.save.mockResolvedValueOnce(updatedProduct);

      const result = await service.updateProduct(mockProduct.id, updateProductDto);

      expect(productRepository.findOne).toHaveBeenCalled();
      expect(productRepository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateProductDto.name);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      await service.deleteProduct(mockProduct.id);

      expect(productRepository.findOne).toHaveBeenCalled();
      expect(productRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});
