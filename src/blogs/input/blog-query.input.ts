import {PaginationAndSorting} from "../../core/types/pagination-and-sorting.input";
import {BlogSortField} from "./blog-sort-field";

export type BlogQueryInput = PaginationAndSorting<BlogSortField> & Partial<{searchNameTerm: string}>;