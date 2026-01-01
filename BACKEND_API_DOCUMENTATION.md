# E-Commerce Backend API - Complete Documentation for Frontend Development

## 📋 Table of Contents
1. [Overview](#overview)
2. [Base Configuration](#base-configuration)
3. [Authentication & Authorization](#authentication--authorization)
4. [Response Format](#response-format)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Frontend Integration Guide](#frontend-integration-guide)

---

## Overview

**Base URL:** `http://localhost:3000/api`  
**API Documentation:** `http://localhost:3000/api/docs` (Swagger UI)  
**Framework:** NestJS with TypeORM (PostgreSQL)  
**Authentication:** JWT Bearer Tokens (Access + Refresh)

---

## Base Configuration

### Global Settings
- **CORS:** Enabled for all origins
- **Global Prefix:** `/api`
- **Validation:** Automatic with `class-validator`
- **Pagination:** Built-in with limit/offset support
- **Response Interceptor:** All responses wrapped in standard format

### Environment
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=200411
DATABASE_NAME=auth
PORT=3000
```

---

## Authentication & Authorization

### Authentication Flow

#### 1. Employee Login
```http
POST /api/auth/employee/signin
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "employee@example.com",
      "role": "employee"
    }
  },
  "message": "Success",
  "statusCode": 200
}
```

#### 2. Customer Login
```http
POST /api/auth/customer/signin
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}

Response: Same format as employee login
```

#### 3. Refresh Access Token
```http
POST /api/auth/access-token
Authorization: Bearer {refreshToken}

Response:
{
  "data": {
    "accessToken": "new_access_token"
  },
  "message": "Success",
  "statusCode": 200
}
```

### Authorization Headers
All authenticated requests require:
```http
Authorization: Bearer {accessToken}
```

### Permission System
Backend uses role-based permissions. Users need specific permissions for operations:
- **Read:** View data
- **Create:** Create new records
- **Update:** Modify existing records
- **Delete:** Remove records

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}
```

### Paginated Response
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "message": "Success",
  "statusCode": 200
}
```

### Error Response
```json
{
  "data": {},
  "message": "Error message here",
  "statusCode": 400
}
```

### Validation Error Response
```json
{
  "message": [
    "email must be an email",
    "password must be longer than 6 characters"
  ],
  "statusCode": 400
}
```

---

## API Endpoints

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/employee/signin` | Employee login | No |
| POST | `/auth/customer/signin` | Customer login | No |
| POST | `/auth/access-token` | Refresh access token | Refresh Token |
| GET | `/auth/all-refresh-tokens` | Get all refresh tokens | No |
| DELETE | `/auth/remove-refresh-token` | Remove refresh tokens | No |

---

### 👤 Users (`/users`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/users` | Get all users (paginated, searchable) | users.read |
| GET | `/users/:id` | Get user by ID | users.read |
| DELETE | `/users/soft/:id` | Soft delete user | users.delete |
| DELETE | `/users/hard/:id` | Hard delete user | users.delete |
| PATCH | `/users/restore/:id` | Restore deleted user | users.update |
| PATCH | `/users/:id` | Update user | users.update |

#### Query Parameters for GET `/users`
```typescript
{
  search?: string;        // Search by name, email, phone
  status?: 'active' | 'deleted' | 'all';
  page?: number;          // Default: 1
  limit?: number;         // Default: 10
}
```

---

### 👥 Customers (`/customers`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/customers` | Get all customers (paginated, searchable) | customers.read |
| GET | `/customers/:id` | Get customer by ID | customers.read |
| POST | `/customers` | Create new customer | customers.create |
| PATCH | `/customers/:id` | Update customer | customers.update |
| DELETE | `/customers/soft/:id` | Soft delete customer | customers.delete |
| DELETE | `/customers/hard/:id` | Hard delete customer | customers.delete |
| PATCH | `/customers/restore/:id` | Restore deleted customer | customers.update |

#### Query Parameters for GET `/customers`
```typescript
{
  search?: string;
  status?: 'active' | 'deleted' | 'all';
  page?: number;
  limit?: number;
}
```

#### Create Customer DTO
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}
```

---

### 👔 Employees (`/employees`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/employees` | Get all employees (paginated, searchable) | employees.read |
| GET | `/employees/:id` | Get employee by ID | employees.read |
| POST | `/employees` | Create new employee | employees.create |
| PATCH | `/employees/:id` | Update employee | employees.update |
| DELETE | `/employees/soft/:id` | Soft delete employee | employees.delete |
| DELETE | `/employees/hard/:id` | Hard delete employee | employees.delete |
| PATCH | `/employees/restore/:id` | Restore deleted employee | employees.update |

---

### 🎭 Roles (`/roles`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/roles` | Get all roles (paginated) | roles.read |
| GET | `/roles/:id` | Get role by ID | roles.read |
| POST | `/roles` | Create new role | roles.create |
| PATCH | `/roles/:id` | Update role | roles.update |
| DELETE | `/roles/:id` | Delete role | roles.delete |

#### Create Role DTO
```typescript
{
  name: string;
  description?: string;
  permissionIds: string[];  // Array of permission UUIDs
}
```

---

### 🔑 Permissions (`/permissions`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/permissions` | Get all permissions (paginated) | permissions.read |
| GET | `/permissions/:id` | Get permission by ID | permissions.read |
| POST | `/permissions` | Create new permission | permissions.create |
| PATCH | `/permissions/:id` | Update permission | permissions.update |
| DELETE | `/permissions/:id` | Delete permission | permissions.delete |

#### Permission Structure
```typescript
{
  name: string;          // e.g., "users.read"
  description?: string;
}
```

---

### 🛍️ Products (`/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products with variants | Yes |
| GET | `/products/:id` | Get product by ID with variants | Yes |
| POST | `/products` | Create new product | Yes |
| PUT | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Delete product (cascades to variants) | Yes |

#### Create Product DTO
```typescript
{
  name: string;              // Max 255 chars
  description?: string;
  sku: string;              // Unique, max 100 chars
  basePrice: number;        // Decimal (10,2)
  stockQuantity?: number;   // Default: 0
  isActive?: boolean;       // Default: true
  imageUrl?: string;        // Max 500 chars
}
```

#### Product Response
```typescript
{
  id: string;
  name: string;
  description: string;
  sku: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl: string;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 📦 Product Variants (`/products/variants`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products/variants/all` | Get all product variants | Yes |
| GET | `/products/:productId/variants` | Get variants for specific product | Yes |
| GET | `/products/variants/:id` | Get variant by ID | Yes |
| POST | `/products/variants` | Create new variant | Yes |
| PUT | `/products/variants/:id` | Update variant | Yes |
| DELETE | `/products/variants/:id` | Delete variant | Yes |

#### Create Product Variant DTO
```typescript
{
  productId: string;              // UUID
  sku: string;                    // Unique
  additionalPrice?: number;       // Default: 0
  stockQuantity?: number;         // Default: 0
  isActive?: boolean;             // Default: true
  imageUrl?: string;
  attributeValueIds?: string[];   // Array of attribute value UUIDs
}
```

#### Product Variant Response
```typescript
{
  id: string;
  productId: string;
  product: Product;
  sku: string;
  additionalPrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl: string;
  attributeValues: AttributeValue[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 🏷️ Attributes (`/products/attributes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products/attributes/all` | Get all attributes with values | Yes |
| GET | `/products/attributes/:id` | Get attribute by ID | Yes |
| POST | `/products/attributes` | Create new attribute | Yes |
| PUT | `/products/attributes/:id` | Update attribute | Yes |
| DELETE | `/products/attributes/:id` | Delete attribute | Yes |

#### Create Attribute DTO
```typescript
{
  name: string;              // Unique, max 100 chars
  description?: string;      // Max 255 chars
  displayOrder?: number;     // Default: 0
  isActive?: boolean;        // Default: true
}
```

#### Attribute Response
```typescript
{
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  values: AttributeValue[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 🎨 Attribute Values (`/products/attribute-values`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products/attribute-values/all` | Get all attribute values | Yes |
| GET | `/products/attributes/:attributeId/values` | Get values for specific attribute | Yes |
| GET | `/products/attribute-values/:id` | Get attribute value by ID | Yes |
| POST | `/products/attribute-values` | Create new attribute value | Yes |
| PUT | `/products/attribute-values/:id` | Update attribute value | Yes |
| DELETE | `/products/attribute-values/:id` | Delete attribute value | Yes |

#### Create Attribute Value DTO
```typescript
{
  attributeId: string;       // UUID
  value: string;             // Max 100 chars
  displayOrder?: number;     // Default: 0
  isActive?: boolean;        // Default: true
}
```

---

### 🔔 Notifications (`/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get all notifications | Yes |
| POST | `/notifications` | Create notification | Yes |

---

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  password: string;  // Hashed
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: Role;
  roleId: string;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  user: User;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Employee
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position?: string;
  department?: string;
  hireDate?: Date;
  salary?: number;
  user: User;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role
```typescript
{
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Permission
```typescript
{
  id: string;
  name: string;          // Format: "resource.action" (e.g., "users.read")
  description?: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Product
```typescript
{
  id: string;
  name: string;
  description?: string;
  sku: string;           // Unique
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ProductVariant
```typescript
{
  id: string;
  productId: string;
  product: Product;
  sku: string;                    // Unique
  additionalPrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string;
  attributeValues: AttributeValue[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Attribute
```typescript
{
  id: string;
  name: string;          // Unique
  description?: string;
  displayOrder: number;
  isActive: boolean;
  values: AttributeValue[];
  createdAt: Date;
  updatedAt: Date;
}
```

### AttributeValue
```typescript
{
  id: string;
  attributeId: string;
  attribute: Attribute;
  value: string;
  displayOrder: number;
  isActive: boolean;
  productVariants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Frontend Integration Guide

### React + TypeScript Setup

#### 1. API Client Setup (Axios)

```typescript
// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data, // Return only data
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/access-token`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );
          
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 2. Type Definitions

```typescript
// src/types/api.types.ts

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  additionalPrice: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string;
  attributeValues: AttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  values: AttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 3. API Service Examples

```typescript
// src/services/auth.service.ts
import { apiClient } from '../api/client';
import { ApiResponse } from '../types/api.types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export const authService = {
  loginEmployee: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return await apiClient.post('/auth/employee/signin', credentials);
  },

  loginCustomer: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return await apiClient.post('/auth/customer/signin', credentials);
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    return await apiClient.post('/auth/access-token', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  },
};

// src/services/product.service.ts
import { apiClient } from '../api/client';
import { ApiResponse, PaginatedResponse, Product, ProductVariant } from '../types/api.types';

export const productService = {
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    return await apiClient.get('/products');
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return await apiClient.get(`/products/${id}`);
  },

  createProduct: async (data: any): Promise<ApiResponse<Product>> => {
    return await apiClient.post('/products', data);
  },

  updateProduct: async (id: string, data: any): Promise<ApiResponse<Product>> => {
    return await apiClient.put(`/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return await apiClient.delete(`/products/${id}`);
  },

  getProductVariants: async (productId: string): Promise<ApiResponse<ProductVariant[]>> => {
    return await apiClient.get(`/products/${productId}/variants`);
  },

  createProductVariant: async (data: any): Promise<ApiResponse<ProductVariant>> => {
    return await apiClient.post('/products/variants', data);
  },
};

// src/services/customer.service.ts
import { apiClient } from '../api/client';
import { PaginatedResponse, Customer } from '../types/api.types';

interface GetCustomersParams {
  search?: string;
  status?: 'active' | 'deleted' | 'all';
  page?: number;
  limit?: number;
}

export const customerService = {
  getCustomers: async (params: GetCustomersParams): Promise<PaginatedResponse<Customer>> => {
    return await apiClient.get('/customers', { params });
  },

  getCustomerById: async (id: string): Promise<ApiResponse<Customer>> => {
    return await apiClient.get(`/customers/${id}`);
  },

  createCustomer: async (data: any): Promise<ApiResponse<Customer>> => {
    return await apiClient.post('/customers', data);
  },

  updateCustomer: async (id: string, data: any): Promise<ApiResponse<Customer>> => {
    return await apiClient.patch(`/customers/${id}`, data);
  },

  deleteCustomer: async (id: string): Promise<void> => {
    return await apiClient.delete(`/customers/soft/${id}`);
  },
};
```

#### 4. React Hook Examples

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string, type: 'employee' | 'customer') => {
    try {
      const response = type === 'employee' 
        ? await authService.loginEmployee({ email, password })
        : await authService.loginCustomer({ email, password });
      
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Validate token or fetch user info
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  return { user, login, logout, loading };
};

// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../types/api.types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
```

#### 5. Component Examples

```typescript
// src/components/ProductList.tsx
import React from 'react';
import { useProducts } from '../hooks/useProducts';

export const ProductList: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.basePrice}</p>
          <p>Stock: {product.stockQuantity}</p>
          {product.variants.length > 0 && (
            <div>
              <h4>Variants:</h4>
              {product.variants.map((variant) => (
                <div key={variant.id}>
                  <p>SKU: {variant.sku}</p>
                  <p>Price: ${product.basePrice + variant.additionalPrice}</p>
                  <p>Stock: {variant.stockQuantity}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## Key Points for Frontend Development

### 1. **Authentication Flow**
- Store `accessToken` and `refreshToken` in localStorage
- Include `Authorization: Bearer {accessToken}` in all authenticated requests
- Implement automatic token refresh on 401 errors
- Redirect to login on refresh token failure

### 2. **Error Handling**
- All errors return standardized format
- Validation errors return array of messages
- Handle 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

### 3. **Pagination**
- Use `page` and `limit` query parameters
- Default limit is 10
- Response includes `meta` with pagination info

### 4. **Search & Filtering**
- Most list endpoints support `search` parameter
- Status filter: `active`, `deleted`, `all`
- Combine filters for advanced queries

### 5. **Product Management**
- Products have base information + variants
- Variants have their own SKU, price, and stock
- Final price = `basePrice + additionalPrice`
- Attributes are defined separately and linked to variants
- One variant can have multiple attribute values

### 6. **Permissions**
- Check user permissions before showing UI elements
- Format: `resource.action` (e.g., `products.create`)
- Handle 403 errors gracefully

### 7. **Soft Delete**
- Most resources support soft delete
- Use `status=deleted` to view deleted items
- Restore endpoints available for soft-deleted items

---

## Testing the API

1. **Start Backend:**
   ```bash
   npm run start:dev
   ```

2. **Access Swagger UI:**
   Open `http://localhost:3000/api/docs`

3. **Test with HTTP Files:**
   Use provided `.http` files in `src/modules/product/http/` with REST Client extension

4. **Example Test Flow:**
   - Create attributes (Color, Size, Storage)
   - Create attribute values (Black, Large, 128GB, etc.)
   - Create products
   - Create product variants with attribute associations
   - Query products with full variant and attribute data

---

## Support & Resources

- **Swagger Documentation:** `http://localhost:3000/api/docs`
- **Product Module README:** `/src/modules/product/README.md`
- **Quick Start Guide:** `/src/modules/product/QUICK_START.md`
- **HTTP Test Files:** `/src/modules/product/http/*.http`

---

## Summary for Frontend Prompt

**Use this documentation to build a React e-commerce application with:**
- User authentication (Employee & Customer portals)
- Product catalog with variants and attributes
- Customer management
- Employee management
- Role-based access control
- Responsive design
- Real-time data updates
- Shopping cart functionality
- Order management (if needed)

All endpoints return consistent JSON format with proper error handling and pagination support.
