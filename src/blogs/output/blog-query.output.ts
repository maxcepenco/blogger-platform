import {BlogViewModel} from "./blog-view-model";

export type BlogQueryOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items:BlogViewModel[];
}
