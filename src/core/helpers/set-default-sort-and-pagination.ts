import {SortDirection} from "../types/sort-direction";
import {BlogSortField} from "../../blogs/types/input/blog-sort-field";
import {BlogQueryInput} from "../../blogs/types/input/blog-query.input";
import {PostQueryInput} from "../../posts/types/input/post-query.input";
import {PostSortField} from "../../posts/types/input/post-sort-field";



export function setDefaultPostQueryParams(query: any): PostQueryInput {
    return {
        pageNumber: parseInt(query.pageNumber, 10) || 1,
        pageSize: parseInt(query.pageSize, 10) || 10,
        sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
        sortDirection: query.sortDirection || SortDirection.Desc,
    };
}
