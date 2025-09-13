

export type PaginateQueryOutput<I> = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: I[]
}
