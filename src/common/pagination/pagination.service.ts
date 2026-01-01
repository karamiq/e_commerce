/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './interfaces/paginated.interface';
import { ObjectLiteral, Repository, SelectQueryBuilder, FindOptionsWhere } from 'typeorm';
import { PaginationQueryDto, StatusFilter } from './dtos/pagination-query.dto';
import type { Request } from 'express';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  public async paginate<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    whereConditions?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page;
    const limit = paginationQuery.limit;
    const status = paginationQuery.status;
    let results: T[] = [];
    let totalItems: number;

    if (status === StatusFilter.DELETED) {
      const alias = repository.metadata.tableName;
      results = await repository.createQueryBuilder(alias)
        .withDeleted()
        .where(`${alias}.deletedAt IS NOT NULL`)
        .take(limit)
        .skip((page - 1) * limit)
        .getMany();
      totalItems = await repository.createQueryBuilder(alias)
        .withDeleted()
        .where(`${alias}.deletedAt IS NOT NULL`)
        .getCount();
    } else {
      results = await repository.find({
        where: whereConditions,
        take: limit,
        skip: (page - 1) * limit,
      });
      totalItems = await repository.count({ where: whereConditions });
    }
    const baseUrl = this.request.protocol + '://' + this.request.headers.host;
    const newUrl = new URL(baseUrl + this.request.originalUrl);
    // the ceil is used to round up the total pages to the nearest integer
    // like from 0.5 to 1

    // the reason we're caculating the total pages is to know how many pages are there
    // which it changes based on the limit
    // so if the limit is 10 and the total items are 20
    // then the total pages will be 2
    // and if the limit is 20 and the total items are 20
    // then the total pages will be 1
    // and if the limit is 30 and the total items are 20
    // then the total pages will be 1
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    const firstPage = 1;
    const lastPage = totalPages;
    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
        links: {
          first: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${firstPage}`,
          last: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${lastPage}`,
          current: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${page}`,
          next: nextPage ? `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${nextPage}` : null,
          previous: previousPage ? `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${previousPage}` : null,
        }
      }
    };
    return finalResponse;
  }

  public async paginateQueryBuilder<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page;
    const limit = paginationQuery.limit;

    query.take(limit).skip((page - 1) * limit);

    const [results, totalItems] = await query.getManyAndCount();

    const baseUrl = this.request.protocol + '://' + this.request.headers.host;
    const newUrl = new URL(baseUrl + this.request.originalUrl);
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    const firstPage = 1;
    const lastPage = totalPages;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
        links: {
          first: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${firstPage}`,
          last: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${lastPage}`,
          current: `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${page}`,
          next: nextPage ? `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${nextPage}` : null,
          previous: previousPage ? `${newUrl.host}${newUrl.pathname}?limit=${limit}&page=${previousPage}` : null,
        }
      }
    };
    return finalResponse;
  }
}