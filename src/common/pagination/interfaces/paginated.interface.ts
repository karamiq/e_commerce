export interface Paginated<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    links: {
      first: string;
      last: string;
      current: string;
      next: string | null;
      previous: string | null;
    };
  }
}
