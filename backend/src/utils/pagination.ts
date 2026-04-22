interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Parses pagination parameters from a query object, ensuring valid constraints.
 * Calculates the appropriate offset based on page number and limit.
 * 
 * @param query - The request query object containing potential page and limit values
 * @param defaults - Optional default and maximum bounds for pagination
 * @param defaults.page - The default starting page (defaults to 1)
 * @param defaults.limit - The default number of items per page (defaults to 50)
 * @param defaults.maxLimit - The maximum allowed items per page (defaults to 200)
 * @returns Parsed and validated pagination parameters (page, limit, offset)
 */
export function parsePagination(query: Record<string, unknown>, defaults = { page: 1, limit: 50, maxLimit: 200 }): PaginationParams {
  const page = Math.max(1, Number(query.page) || defaults.page);
  const limit = Math.min(defaults.maxLimit, Math.max(1, Number(query.limit) || defaults.limit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export type {};
