import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { StatusFilter } from '../dtos/pagination-query.dto';

export interface SearchConfig<T extends ObjectLiteral> {
  query: SelectQueryBuilder<T>;
  searchTerm?: string;
  searchFields: string[]; // e.g., ['user.firstName', 'user.lastName', 'user.email']
}

export interface FilterConfig<T extends ObjectLiteral> {
  query: SelectQueryBuilder<T>;
  filters: Record<string, string | undefined>; // e.g., { 'role.name': roleName, 'customer.shippingAddress': address }
}

export class QueryBuilderHelper {
  /**
   * Apply soft delete filtering based on status
   */
  static applySoftDeleteFilter<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    status: StatusFilter,
    entityAlias: string,
  ): void {
    switch (status) {
      case StatusFilter.DELETED:
        query.withDeleted().where(`${entityAlias}.deletedAt IS NOT NULL`);
        break;
      case StatusFilter.ALL:
        query.withDeleted();
        break;
      case StatusFilter.ACTIVE:
      default:
        // By default, TypeORM excludes soft-deleted records
        break;
    }
  }

  /**
   * Apply search across multiple fields with ILIKE (case-insensitive)
   */
  static applySearch<T extends ObjectLiteral>(config: SearchConfig<T>): void {
    const { query, searchTerm, searchFields } = config;

    if (searchTerm && searchFields.length > 0) {
      const conditions = searchFields
        .map((field) => `${field} ILIKE :search`)
        .join(' OR ');

      query.andWhere(`(${conditions})`, { search: `%${searchTerm}%` });
    }
  }

  /**
   * Apply multiple filters with ILIKE (case-insensitive)
   */
  static applyFilters<T extends ObjectLiteral>(config: FilterConfig<T>): void {
    const { query, filters } = config;

    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        const paramName = field.replace('.', '_');
        query.andWhere(`${field} ILIKE :${paramName}`, {
          [paramName]: `%${value}%`,
        });
      }
    });
  }
}

/*
    // Apply soft delete filtering
    QueryBuilderHelper.applySoftDeleteFilter(query, status, 'customer');

    // Apply search across user fields
    QueryBuilderHelper.applySearch({
      query,
      searchTerm: search,
      searchFields: ['user.firstName', 'user.lastName', 'user.email', 'user.phoneNumber'],
    });

    // Apply shipping address filter
    QueryBuilderHelper.applyFilters({
      query,
      filters: { 'customer.shippingAddress': shippingAddress },
    });



       // Apply soft delete filtering
    QueryBuilderHelper.applySoftDeleteFilter(query, status, 'employee');

    // Apply search across user fields
    QueryBuilderHelper.applySearch({
      query,
      searchTerm: search,
      searchFields: ['user.firstName', 'user.lastName', 'user.email'],
    });

    // Apply role filter
    QueryBuilderHelper.applyFilters({
      query,
      filters: { 'role.name': role },
    });

    */