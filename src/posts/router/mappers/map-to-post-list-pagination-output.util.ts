import {WithId} from "mongodb";
import {PostQueryOutput} from "../../output/post-query.output";
import {Post} from "../../domain/Post";
import {mapPostToViewModel} from "./mapPostToViewModel";

export function mapToPostListPaginationOutput(
    items: WithId<Post>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number

): PostQueryOutput {
    const pagesCount = Math.ceil(totalCount/ pageSize);

    return {
        pagesCount,
        page:pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items.map(mapPostToViewModel)
    }
}