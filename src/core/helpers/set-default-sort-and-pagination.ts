import {SortDirection} from "../types/sort-direction";
import {BlogSortField} from "../../blogs/input/blog-sort-field";
import {BlogQueryInput} from "../../blogs/input/blog-query.input";
import {PostQueryInput} from "../../posts/input/post-query.input";
import {PostSortField} from "../../posts/input/post-sort-field";
import {QueryParams} from "../types/QuareParams";


export function setDefaultBlogQueryParams(query: any): BlogQueryInput {
    return {
        pageNumber: parseInt(query.pageNumber, 10) || 1,
        pageSize: parseInt(query.pageSize, 10) || 10,
        sortBy: (query.sortBy as BlogSortField) || BlogSortField.CreatedAt,
        sortDirection: query.sortDirection || SortDirection.Desc,
        searchNameTerm: query.searchNameTerm || undefined
    };
}

export function setDefaultPostQueryParams(query: any): PostQueryInput {
    return {
        pageNumber: parseInt(query.pageNumber, 10) || 1,
        pageSize: parseInt(query.pageSize, 10) || 10,
        sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
        sortDirection: query.sortDirection || SortDirection.Desc,
    };
}
