import {SortQueryFieldsType} from "../../../core/types/sortQueryFields.type";


export type UserQueryFieldType = SearchQueryFieldType & SortQueryFieldsType


export type SearchQueryFieldType = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}