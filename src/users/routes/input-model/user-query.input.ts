import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting.input";
import {UserQueryFieldType} from "./user-query-field.type";
import {UserSortField} from "./user-sort-field";

export type UserQueryInput = PaginationAndSorting<UserSortField> & UserQueryFieldType
