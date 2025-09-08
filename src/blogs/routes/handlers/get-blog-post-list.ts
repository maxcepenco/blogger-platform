import {PostQueryInput} from "../../../posts/input/post-query.input";
import {postService} from "../../../posts/application/post.service";
import {mapToPostListPaginationOutput} from "../../../posts/router/mappers/map-to-post-list-pagination-output.util";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Request, Response} from "express";
import {blogRepository} from "../../repository/blogRepository";
import {setDefaultPostQueryParams,} from "../../../core/helpers/set-default-sort-and-pagination";


export async function getBlogPostList(
    req: Request<{ blogId: string }>,
    res: Response,
) {
        const query = req.query as unknown as PostQueryInput
        const blogId = req.params.blogId;

        const blogExists = await blogRepository.findByIdForGet(blogId);
        if (!blogExists) {
            res.sendStatus(HttpStatuses.NotFound_404)
                return
        }
        const  queryInput = setDefaultPostQueryParams(query)

        const { items, totalCount } = await postService.findPostByBlog(
            queryInput,
            blogId,
        );
        const postListOutput = mapToPostListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
        res.status(HttpStatuses.Ok_200).send(postListOutput)



}