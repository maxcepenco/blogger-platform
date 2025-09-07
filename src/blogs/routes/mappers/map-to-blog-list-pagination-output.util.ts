import {WithId} from "mongodb";
import {BlogQueryOutput} from "../../output/blog-query.output";
import {mapToBlogViewModel} from "./mapToBlogViewModel";
import {Blog} from "../../domain/Blog";

export function mapToBlogListPaginationOutput(
    items: WithId<Blog>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number

): BlogQueryOutput {
    const pagesCount = Math.ceil(totalCount/ pageSize);

    return {
        pagesCount,
        page:pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items.map(mapToBlogViewModel)
    }
}