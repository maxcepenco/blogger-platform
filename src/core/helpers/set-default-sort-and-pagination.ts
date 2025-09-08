import {SortDirection} from "../types/sort-direction";
import {BlogSortField} from "../../blogs/input/blog-sort-field";
import {BlogQueryInput} from "../../blogs/input/blog-query.input";
import {PostQueryInput} from "../../posts/input/post-query.input";
import {PostSortField} from "../../posts/input/post-sort-field";


export function setDefaultBlogQueryParams(query: any): BlogQueryInput {
    return {
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
        sortBy: (query.sortBy as BlogSortField) || BlogSortField.CreatedAt,
        sortDirection: query.sortDirection || SortDirection.Desc,
        searchNameTerm: query.searchNameTerm || undefined
    };
}

export function setDefaultPostQueryParams(query: any): PostQueryInput {
    return {
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
        sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
        sortDirection: query.sortDirection || SortDirection.Desc,

    };
}