import {PaginationAndSorting} from "../../core/types/pagination-and-sorting.input";
import {PostSortField} from "./post-sort-field";

export type PostQueryInput = PaginationAndSorting<PostSortField> ;