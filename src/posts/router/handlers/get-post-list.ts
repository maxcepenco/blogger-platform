import {Response} from 'express';
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {PostQueryInput} from "../../input/post-query.input";
import {setDefaultPostQueryParams} from "../../../core/helpers/set-default-sort-and-pagination";
import {postQueryRepository} from "../../repository/post.query-repository";

export const getPostList = async (req: RequestWithQuery<PostQueryInput>, res: Response) => {
    const queryInput = setDefaultPostQueryParams(req.query)

    const {items, totalCount} = await postQueryRepository.findMany(queryInput)

    const postListOutput = postQueryRepository.mapToPostListPaginationOutput(
        items,
        queryInput.pageNumber,
        queryInput.pageSize,
        totalCount,
    )
    res.status(HttpStatuses.Ok_200).send(postListOutput)
}