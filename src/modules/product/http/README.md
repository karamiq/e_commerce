# HTTP Request Files

This directory contains REST Client (.http) files for testing the Product Management API.

## Prerequisites

1. **VS Code REST Client Extension**: Install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code
2. **Running Server**: Make sure your NestJS application is running (`npm run start:dev`)
3. **Authentication Token**: Obtain a valid JWT access token from the auth endpoints

## Files Overview

### 1. `attributes.http`
Creates and manages product attributes (Color, Size, Storage, Material, Style, Memory).
- **6 Attribute Creation Requests** with sample data
- CRUD operations for attributes

### 2. `attribute-values.http`
Creates specific values for each attribute (Red, Large, 128GB, etc.).
- **30+ Attribute Value Creation Requests** organized by attribute type:
  - 6 Color values (Black, White, Silver, Gold, Blue, Red)
  - 5 Size values (Small, Medium, Large, X-Large, XX-Large)
  - 5 Storage values (64GB, 128GB, 256GB, 512GB, 1TB)
  - 5 Material values (Cotton, Polyester, Leather, Denim, Wool)
  - 5 Style values (Casual, Formal, Sport, Business, Vintage)

### 3. `products.http`
Creates main products without variants.
- **7 Product Creation Requests**:
  - iPhone 15 Pro
  - MacBook Pro 16"
  - AirPods Pro
  - iPad Air
  - Apple Watch Series 9
  - Samsung Galaxy S24 Ultra
  - Sony WH-1000XM5 Headphones

### 4. `product-variants.http`
Creates product variants with attribute associations.
- **10+ Product Variant Creation Requests** for iPhone 15 Pro
- Demonstrates combining color and storage attributes

### 5. `complete-workflow.http` ⭐ **RECOMMENDED FOR FIRST USE**
End-to-end workflow demonstrating the complete process.
- Creates attributes → attribute values → products → variants
- Uses response variables to chain requests
- Self-contained and ready to execute sequentially

## How to Use

### Option 1: Complete Workflow (Recommended)

1. Open `complete-workflow.http`
2. Update the `@token` variable with your JWT access token
3. Execute requests **in order** from top to bottom
4. The file uses REST Client's response references to automatically pass IDs between requests

### Option 2: Individual Files

1. **First Time Setup**:
   ```
   a. Execute all requests in `attributes.http`
   b. Copy returned attribute IDs and update variables in `attribute-values.http`
   c. Execute all requests in `attribute-values.http`
   d. Copy returned IDs and update variables in `products.http`
   e. Execute all requests in `products.http`
   f. Copy returned IDs and update variables in `product-variants.http`
   g. Execute requests in `product-variants.http`
   ```

2. **Update Variables**: 
   - Replace `YOUR_ACCESS_TOKEN_HERE` with your actual JWT token
   - Replace placeholder IDs (e.g., `REPLACE_WITH_ACTUAL_ID`) with real IDs from responses

### Executing Requests in VS Code

1. **Single Request**: Click "Send Request" above any request
2. **All Requests**: Right-click and select "Send All Requests"
3. **View Response**: Response appears in a new editor tab

## Variable Management

### Common Variables
```http
@baseUrl = http://localhost:3000
@token = YOUR_ACCESS_TOKEN_HERE
```

### Using Response Variables (REST Client Feature)
```http
# @name createProduct
POST {{baseUrl}}/products
...

# Use the ID from the previous response
GET {{baseUrl}}/products/{{createProduct.response.body.id}}
```

## Testing Workflow

### Quick Test (5 minutes)
Use `complete-workflow.http` and execute all requests sequentially.

### Full Test (15 minutes)
1. Create all attributes from `attributes.http`
2. Create all attribute values from `attribute-values.http`
3. Create all products from `products.http`
4. Create variants for multiple products using `product-variants.http`
5. Verify data using GET requests

## Sample Data Summary

| Entity | Count | Examples |
|--------|-------|----------|
| Attributes | 6 | Color, Size, Storage, Material, Style, Memory |
| Attribute Values | 30+ | Black, Large, 256GB, Cotton, Casual |
| Products | 7 | iPhone 15 Pro, MacBook Pro, Galaxy S24 |
| Product Variants | 10+ | iPhone Black 128GB, Galaxy Silver 512GB |

## Tips

1. **Execute in Order**: Attributes → Values → Products → Variants
2. **Save IDs**: Keep track of created IDs for future reference
3. **Use Variables**: Define variables at the top of each file
4. **Check Responses**: Verify successful creation (201 status code)
5. **Update Token**: Tokens expire - refresh when needed

## Common Issues

### 401 Unauthorized
- Update your `@token` variable with a fresh JWT token

### 400 Bad Request - Duplicate SKU
- SKUs must be unique. Change the SKU value if re-running requests

### 404 Not Found
- Verify that parent entities (products, attributes) exist before creating children

### 400 Bad Request - Invalid attribute value IDs
- Ensure attribute value IDs in variant creation exist in the database

## Cleanup

To reset the database:
```sql
DELETE FROM product_variant_attributes;
DELETE FROM product_variants;
DELETE FROM attribute_values;
DELETE FROM attributes;
DELETE FROM products;
```

Or simply restart with `synchronize: true` in TypeORM config (development only).

## Next Steps

After testing with these files:
1. Integrate with your frontend
2. Add pagination to list endpoints
3. Implement search and filtering
4. Add image upload functionality
5. Create order management integration
