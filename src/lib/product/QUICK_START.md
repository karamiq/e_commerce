# Product Module Quick Start Guide

## 🚀 Getting Started

### 1. Start the Application

```bash
npm run start:dev
```

### 2. Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:3000/api
```

## 📝 Step-by-Step Example: Create a Complete Product with Variants

### Step 1: Create Attributes

**Request:** `POST /products/attributes`

```json
{
  "name": "Color",
  "description": "Product color options",
  "displayOrder": 1,
  "isActive": true
}
```

**Save the returned `id` as `colorAttributeId`**

---

**Request:** `POST /products/attributes`

```json
{
  "name": "Storage",
  "description": "Storage capacity",
  "displayOrder": 2,
  "isActive": true
}
```

**Save the returned `id` as `storageAttributeId`**

### Step 2: Create Attribute Values

**Request:** `POST /products/attribute-values`

```json
{
  "attributeId": "<colorAttributeId>",
  "value": "Black",
  "displayOrder": 1,
  "isActive": true
}
```

**Save as `blackValueId`**

---

**Request:** `POST /products/attribute-values`

```json
{
  "attributeId": "<colorAttributeId>",
  "value": "Silver",
  "displayOrder": 2,
  "isActive": true
}
```

**Save as `silverValueId`**

---

**Request:** `POST /products/attribute-values`

```json
{
  "attributeId": "<storageAttributeId>",
  "value": "128GB",
  "displayOrder": 1,
  "isActive": true
}
```

**Save as `storage128Id`**

---

**Request:** `POST /products/attribute-values`

```json
{
  "attributeId": "<storageAttributeId>",
  "value": "256GB",
  "displayOrder": 2,
  "isActive": true
}
```

**Save as `storage256Id`**

### Step 3: Create a Product

**Request:** `POST /products`

```json
{
  "name": "iPhone 15 Pro",
  "description": "The most powerful iPhone ever",
  "sku": "IPHONE-15-PRO",
  "basePrice": 999.00,
  "stockQuantity": 0,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro.jpg"
}
```

**Save the returned `id` as `productId`**

### Step 4: Create Product Variants

**Variant 1: Black 128GB**

**Request:** `POST /products/variants`

```json
{
  "productId": "<productId>",
  "sku": "IPHONE-15-PRO-BLK-128",
  "additionalPrice": 0,
  "stockQuantity": 25,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro-black.jpg",
  "attributeValueIds": [
    "<blackValueId>",
    "<storage128Id>"
  ]
}
```

---

**Variant 2: Black 256GB**

**Request:** `POST /products/variants`

```json
{
  "productId": "<productId>",
  "sku": "IPHONE-15-PRO-BLK-256",
  "additionalPrice": 100,
  "stockQuantity": 30,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro-black.jpg",
  "attributeValueIds": [
    "<blackValueId>",
    "<storage256Id>"
  ]
}
```

---

**Variant 3: Silver 128GB**

**Request:** `POST /products/variants`

```json
{
  "productId": "<productId>",
  "sku": "IPHONE-15-PRO-SLV-128",
  "additionalPrice": 0,
  "stockQuantity": 20,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro-silver.jpg",
  "attributeValueIds": [
    "<silverValueId>",
    "<storage128Id>"
  ]
}
```

---

**Variant 4: Silver 256GB**

**Request:** `POST /products/variants`

```json
{
  "productId": "<productId>",
  "sku": "IPHONE-15-PRO-SLV-256",
  "additionalPrice": 100,
  "stockQuantity": 15,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro-silver.jpg",
  "attributeValueIds": [
    "<silverValueId>",
    "<storage256Id>"
  ]
}
```

### Step 5: Retrieve the Complete Product

**Request:** `GET /products/<productId>`

**Response:** You'll get the product with all variants and their attributes:

```json
{
  "id": "...",
  "name": "iPhone 15 Pro",
  "description": "The most powerful iPhone ever",
  "sku": "IPHONE-15-PRO",
  "basePrice": 999.00,
  "stockQuantity": 0,
  "isActive": true,
  "imageUrl": "https://example.com/iphone15pro.jpg",
  "variants": [
    {
      "id": "...",
      "sku": "IPHONE-15-PRO-BLK-128",
      "additionalPrice": 0,
      "stockQuantity": 25,
      "attributeValues": [
        {
          "id": "...",
          "value": "Black",
          "attribute": {
            "id": "...",
            "name": "Color"
          }
        },
        {
          "id": "...",
          "value": "128GB",
          "attribute": {
            "id": "...",
            "name": "Storage"
          }
        }
      ]
    }
    // ... other variants
  ],
  "createdAt": "2025-12-29T...",
  "updatedAt": "2025-12-29T..."
}
```

## 🔍 Common Queries

### Get all products with their variants
```
GET /products
```

### Get all variants for a specific product
```
GET /products/<productId>/variants
```

### Get all values for a specific attribute
```
GET /products/attributes/<attributeId>/values
```

### Get all attributes with their values
```
GET /products/attributes/all
```

## 💡 Tips

1. **SKUs must be unique** - Both product SKUs and variant SKUs must be unique across the entire system
2. **Base Price + Additional Price** - The final price of a variant is `basePrice + additionalPrice`
3. **Attribute Values are reusable** - The same attribute value can be used across multiple variants
4. **Cascading Deletes** - Deleting a product will delete all its variants automatically
5. **Authentication Required** - All endpoints require a valid Bearer token

## 🧪 Testing with cURL

### Create an Attribute (Color)
```bash
curl -X POST http://localhost:3000/products/attributes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Color",
    "description": "Product color options",
    "displayOrder": 1,
    "isActive": true
  }'
```

### Get All Products
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Product
```bash
curl -X PUT http://localhost:3000/products/<productId> \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 1099.00,
    "stockQuantity": 150
  }'
```

### Delete a Product
```bash
curl -X DELETE http://localhost:3000/products/<productId> \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⚠️ Important Notes

- Replace `<productId>`, `<attributeId>`, etc. with actual IDs returned from API calls
- Replace `YOUR_TOKEN` with a valid JWT access token
- All IDs are UUIDs (e.g., `123e4567-e89b-12d3-a456-426614174000`)
- The application uses PostgreSQL - make sure it's running and configured correctly
