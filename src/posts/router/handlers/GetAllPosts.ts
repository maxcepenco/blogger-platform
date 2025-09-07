import {Request, Response} from 'express';
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {mapPostToViewModel} from "../mappers/mapPostToViewModel";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {PostQueryInput} from "../../input/post-query.input";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {postService} from "../../application/post.service";
import {mapToPostListPaginationOutput} from "../mappers/map-to-post-list-pagination-output.util";

export const getAllPosts = async (req:RequestWithQuery<PostQueryInput>, res:Response) => {
 const queryInput = setDefaultSortAndPaginationIfNotExist(req.query)

    const {items, totalCount} = await postService.findMany(queryInput)

    const postListOutput = mapToPostListPaginationOutput(
        items,
        totalCount,
        queryInput.pageSize,
        queryInput.pageNumber
        )
    res.status(HttpStatuses.Ok_200).send(postListOutput)

}


