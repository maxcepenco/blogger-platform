import {Response} from 'express';
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {PostQueryInput} from "../../input/post-query.input";

import {postService} from "../../application/post.service";
import {mapToPostListPaginationOutput} from "../mappers/map-to-post-list-pagination-output.util";
import {PostSortField} from "../../input/post-sort-field";
import {setDefaultPostQueryParams} from "../../../core/helpers/set-default-sort-and-pagination";

export const getAllPosts = async (req: RequestWithQuery<PostQueryInput>, res: Response) => {

    const queryInput = setDefaultPostQueryParams(req.query)

    const {items, totalCount} = await postService.findMany(queryInput)

    const postListOutput = mapToPostListPaginationOutput(
        items,
        queryInput.pageNumber,
        queryInput.pageSize,
        totalCount,
    )
    res.status(HttpStatuses.Ok_200).send(postListOutput)
}


