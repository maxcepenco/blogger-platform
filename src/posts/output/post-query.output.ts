import {PostViewModel} from "./PostViewModel";

export type PostQueryOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items:PostViewModel[];
}
