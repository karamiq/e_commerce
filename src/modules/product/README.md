# Product Management API

This module handles the complete product management system for the e-commerce application, including products, product variants, attributes, and attribute values.

## Entity Relationships

```
Product (1) ----< (Many) ProductVariant
Attribute (1) ----< (Many) AttributeValue
ProductVariant (Many) >----< (Many) AttributeValue
```

### Database Tables

1. **products** - Main product information
2. **product_variants** - Product variations (e.g., different sizes, colors)
3. **attributes** - Attribute definitions (e.g., "Color", "Size")
4. **attribute_values** - Specific attribute values (e.g., "Red", "Large")
5. **product_variant_attributes** - Join table linking variants to their attribute values

## API Endpoints

### Products

- `POST /products` - Create a new product
- `GET /products` - Get all products (with variants and attributes)
- `GET /products/:id` - Get a specific product by ID
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Product Variants

- `POST /products/variants` - Create a new product variant
- `GET /products/variants/all` - Get all product variants
- `GET /products/:productId/variants` - Get all variants for a specific product
- `GET /products/variants/:id` - Get a specific product variant
- `PUT /products/variants/:id` - Update a product variant
- `DELETE /products/variants/:id` - Delete a product variant

### Attributes

- `POST /products/attributes` - Create a new attribute
- `GET /products/attributes/all` - Get all attributes
- `GET /products/attributes/:id` - Get a specific attribute
- `PUT /products/attributes/:id` - Update an attribute
- `DELETE /products/attributes/:id` - Delete an attribute

### Attribute Values

- `POST /products/attribute-values` - Create a new attribute value
- `GET /products/attribute-values/all` - Get all attribute values
- `GET /products/attributes/:attributeId/values` - Get all values for a specific attribute
- `GET /products/attribute-values/:id` - Get a specific attribute value
- `PUT /products/attribute-values/:id` - Update an attribute value
- `DELETE /products/attribute-values/:id` - Delete an attribute value

## Example Usage

### 1. Create a Product

```json
POST /products
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with advanced features",
  "sku": "IP15PRO-BASE",
  "basePrice": 999.99,
  "stockQuantity": 100,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro.jpg"
}
```

### 2. Create Attributes

```json
POST /products/attributes
{
  "name": "Color",
  "description": "Product color options",
  "displayOrder": 1,
  "isActive": true
}
```

```json
POST /products/attributes
{
  "name": "Storage",
  "description": "Storage capacity options",
  "displayOrder": 2,
  "isActive": true
}
```

### 3. Create Attribute Values

```json
POST /products/attribute-values
{
  "attributeId": "color-attribute-id",
  "value": "Natural Titanium",
  "displayOrder": 1,
  "isActive": true
}
```

```json
POST /products/attribute-values
{
  "attributeId": "storage-attribute-id",
  "value": "256GB",
  "displayOrder": 1,
  "isActive": true
}
```

### 4. Create Product Variant

```json
POST /products/variants
{
  "productId": "product-id",
  "sku": "IP15PRO-256-TITANIUM",
  "additionalPrice": 0,
  "stockQuantity": 25,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro-titanium.jpg",
  "attributeValueIds": [
    "natural-titanium-value-id",
    "256gb-value-id"
  ]
}
```

## Field Descriptions

### Product Fields

- `name` (string, required) - Product name
- `description` (string, optional) - Detailed product description
- `sku` (string, required, unique) - Stock Keeping Unit
- `basePrice` (decimal, required) - Base price of the product
- `stockQuantity` (number, optional, default: 0) - Available stock quantity
- `isActive` (boolean, optional, default: true) - Product active status
- `imageUrl` (string, optional) - Product image URL

### Product Variant Fields

- `productId` (UUID, required) - Reference to parent product
- `sku` (string, required, unique) - Variant SKU
- `additionalPrice` (decimal, optional, default: 0) - Price difference from base product
- `stockQuantity` (number, optional, default: 0) - Variant stock quantity
- `isActive` (boolean, optional, default: true) - Variant active status
- `imageUrl` (string, optional) - Variant-specific image URL
- `attributeValueIds` (array of UUIDs, optional) - Associated attribute values

### Attribute Fields

- `name` (string, required, unique) - Attribute name (e.g., "Color", "Size")
- `description` (string, optional) - Attribute description
- `displayOrder` (number, optional, default: 0) - Display order
- `isActive` (boolean, optional, default: true) - Attribute active status

### Attribute Value Fields

- `attributeId` (UUID, required) - Reference to parent attribute
- `value` (string, required) - Attribute value (e.g., "Red", "Large")
- `displayOrder` (number, optional, default: 0) - Display order
- `isActive` (boolean, optional, default: true) - Attribute value active status

## Business Logic

### Validation Rules

1. **Product SKU** must be unique across all products
2. **Variant SKU** must be unique across all variants
3. **Attribute name** must be unique across all attributes
4. Parent entities must exist when creating child entities
5. Cannot delete entities that have dependent child records (handled by cascade)

### Cascade Behavior

- Deleting a **Product** will delete all its **ProductVariants**
- Deleting an **Attribute** will delete all its **AttributeValues**
- Deleting a **ProductVariant** will remove its associations but not the **AttributeValues**

## Error Responses

### 400 Bad Request
- Duplicate SKU
- Invalid attribute value IDs
- Validation errors

### 404 Not Found
- Product not found
- Variant not found
- Attribute not found
- Attribute value not found

## Notes

- All entities have `createdAt` and `updatedAt` timestamps
- UUIDs are used for all primary keys
- Soft delete is not implemented (records are permanently deleted)
- All endpoints require authentication (Bearer token)
- API documentation is available via Swagger at `/api`
