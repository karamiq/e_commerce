
# E-Commerce Backend API

This project is a modular, scalable e-commerce backend built with [NestJS](https://nestjs.com/) and TypeScript. It provides RESTful APIs for authentication, user management, product catalog, roles, permissions, and more.

## Features

- **Modular Architecture:** Each feature (auth, products, users, roles, permissions, etc.) is implemented as a separate NestJS module for maintainability and scalability.
- **Authentication & Authorization:** JWT-based authentication with access/refresh tokens, custom guards, and decorators for secure, role-based access control.
- **Reusable Utilities:** Includes global error filters, response interceptors, and pagination helpers for consistent API behavior.
- **Type Safety:** Uses TypeScript DTOs and entities for data validation and modeling.
- **Testing:** End-to-end and unit tests ensure API reliability.


## Getting Started

### Install dependencies

```bash
npm install
```

### Run the project

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

### Run tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

- `src/common`: Shared utilities (guards, filters, interceptors, pagination, etc.)
- `src/config`: Configuration for database, JWT, and environment
- `src/modules`: Feature modules (auth, users, products, roles, permissions, etc.)
- `test`: End-to-end tests

## Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js, TypeScript)
- **Authentication:** JWT (access/refresh tokens), custom guards, decorators
- **Database:** (Configure in `src/config/database.config.ts`)
- **Testing:** Jest
- **Linting:** ESLint

## License

MIT
