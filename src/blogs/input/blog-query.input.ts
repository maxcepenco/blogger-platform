import {PaginationAndSorting} from "../../core/types/pagination-and-sorting.input";
import {BlogSortField} from "./blog-sort-field";
import {BlogQueryFieldsType} from "./blog-query-field-type";

export type BlogQueryInput = PaginationAndSorting<BlogSortField> & BlogQueryFieldsType
