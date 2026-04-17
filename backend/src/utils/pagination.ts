interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: Record<string, unknown>, defaults = { page: 1, limit: 50, maxLimit: 200 }): PaginationParams {
  const page = Math.max(1, Number(query.page) || defaults.page);
  const limit = Math.min(defaults.maxLimit, Math.max(1, Number(query.limit) || defaults.limit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export type {};
