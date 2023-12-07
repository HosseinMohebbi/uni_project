export class PaginationUtil {
  public static calculatePageCount(totalItems: number, pageSize = 10): number {
    return Math.ceil(totalItems / pageSize);
  }

  public static paginateHandler(page = 1, pageSize = 10) {
    page = page > 0 ? page : 1;
    pageSize = pageSize > 0 ? pageSize : 10;
    const skip = (page - 1) * pageSize;
    return {
      page,
      pageSize,
      skip,
    };
  }

  public static metaPagination(total: number, page: number, pageSize: number) {
    const totalPage = this.calculatePageCount(total, pageSize);
    return {
      totalPage,
      currentPage: page,
      pageSize,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPage ? page + 1 : null,
    };
  }
}
